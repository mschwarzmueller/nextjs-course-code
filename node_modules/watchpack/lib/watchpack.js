/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
"use strict";

const getWatcherManager = require("./getWatcherManager");
const LinkResolver = require("./LinkResolver");
const EventEmitter = require("events").EventEmitter;
const globToRegExp = require("glob-to-regexp");

let EXISTANCE_ONLY_TIME_ENTRY; // lazy required

const EMPTY_ARRAY = [];

function addWatchersToSet(watchers, set) {
	for (const w of watchers) {
		if (w !== true && !set.has(w.directoryWatcher)) {
			set.add(w.directoryWatcher);
			addWatchersToSet(w.directoryWatcher.directories.values(), set);
		}
	}
}

const stringToRegexp = ignored => {
	const source = globToRegExp(ignored, { globstar: true, extended: true })
		.source;
	const matchingStart = source.slice(0, source.length - 1) + "(?:$|\\/)";
	return matchingStart;
};

const ignoredToRegexp = ignored => {
	if (Array.isArray(ignored)) {
		return new RegExp(ignored.map(i => stringToRegexp(i)).join("|"));
	} else if (typeof ignored === "string") {
		return new RegExp(stringToRegexp(ignored));
	} else if (ignored instanceof RegExp) {
		return ignored;
	} else if (ignored) {
		throw new Error(`Invalid option for 'ignored': ${ignored}`);
	} else {
		return undefined;
	}
};

const normalizeOptions = options => {
	return {
		followSymlinks: !!options.followSymlinks,
		ignored: ignoredToRegexp(options.ignored),
		poll: options.poll
	};
};

const normalizeCache = new WeakMap();
const cachedNormalizeOptions = options => {
	const cacheEntry = normalizeCache.get(options);
	if (cacheEntry !== undefined) return cacheEntry;
	const normalized = normalizeOptions(options);
	normalizeCache.set(options, normalized);
	return normalized;
};

class Watchpack extends EventEmitter {
	constructor(options) {
		super();
		if (!options) options = {};
		if (typeof options.aggregateTimeout !== "number") {
			options.aggregateTimeout = 200;
		}
		this.options = options;
		this.watcherOptions = cachedNormalizeOptions(options);
		this.watcherManager = getWatcherManager(this.watcherOptions);
		this.watchers = [];
		this.paused = false;
		this.aggregatedChanges = new Set();
		this.aggregatedRemovals = new Set();
		this.aggregateTimeout = 0;
		this._onTimeout = this._onTimeout.bind(this);
	}

	watch(arg1, arg2, arg3) {
		let files, directories, missing, startTime;
		if (!arg2) {
			({
				files = EMPTY_ARRAY,
				directories = EMPTY_ARRAY,
				missing = EMPTY_ARRAY,
				startTime
			} = arg1);
		} else {
			files = arg1;
			directories = arg2;
			missing = EMPTY_ARRAY;
			startTime = arg3;
		}
		this.paused = false;
		const oldWatchers = this.watchers;
		const ignored = this.watcherOptions.ignored;
		const filter = ignored
			? path => !ignored.test(path.replace(/\\/g, "/"))
			: () => true;
		this.watchers = [];
		if (this.watcherOptions.followSymlinks) {
			const resolver = new LinkResolver();
			for (const file of files) {
				if (filter(file)) {
					for (const innerFile of resolver.resolve(file)) {
						if (file === innerFile || filter(innerFile)) {
							const watcher = this._fileWatcher(
								file,
								this.watcherManager.watchFile(innerFile, startTime)
							);
							if (watcher) this.watchers.push(watcher);
						}
					}
				}
			}
			for (const file of missing) {
				if (filter(file)) {
					for (const innerFile of resolver.resolve(file)) {
						if (file === innerFile || filter(innerFile)) {
							const watcher = this._missingWatcher(
								file,
								this.watcherManager.watchFile(innerFile, startTime)
							);
							if (watcher) this.watchers.push(watcher);
						}
					}
				}
			}
			for (const dir of directories) {
				if (filter(dir)) {
					let first = true;
					for (const innerItem of resolver.resolve(dir)) {
						if (filter(innerItem)) {
							const watcher = this._dirWatcher(
								dir,
								first
									? this.watcherManager.watchDirectory(innerItem, startTime)
									: this.watcherManager.watchFile(innerItem, startTime)
							);
							if (watcher) this.watchers.push(watcher);
						}
						first = false;
					}
				}
			}
		} else {
			for (const file of files) {
				if (filter(file)) {
					const watcher = this._fileWatcher(
						file,
						this.watcherManager.watchFile(file, startTime)
					);
					if (watcher) this.watchers.push(watcher);
				}
			}
			for (const file of missing) {
				if (filter(file)) {
					const watcher = this._missingWatcher(
						file,
						this.watcherManager.watchFile(file, startTime)
					);
					if (watcher) this.watchers.push(watcher);
				}
			}
			for (const dir of directories) {
				if (filter(dir)) {
					const watcher = this._dirWatcher(
						dir,
						this.watcherManager.watchDirectory(dir, startTime)
					);
					if (watcher) this.watchers.push(watcher);
				}
			}
		}
		for (const w of oldWatchers) w.close();
	}

	close() {
		this.paused = true;
		if (this.aggregateTimeout) clearTimeout(this.aggregateTimeout);
		for (const w of this.watchers) w.close();
		this.watchers.length = 0;
	}

	pause() {
		this.paused = true;
		if (this.aggregateTimeout) clearTimeout(this.aggregateTimeout);
	}

	getTimes() {
		const directoryWatchers = new Set();
		addWatchersToSet(this.watchers, directoryWatchers);
		const obj = Object.create(null);
		for (const w of directoryWatchers) {
			const times = w.getTimes();
			for (const file of Object.keys(times)) obj[file] = times[file];
		}
		return obj;
	}

	getTimeInfoEntries() {
		if (EXISTANCE_ONLY_TIME_ENTRY === undefined) {
			EXISTANCE_ONLY_TIME_ENTRY = require("./DirectoryWatcher")
				.EXISTANCE_ONLY_TIME_ENTRY;
		}
		const directoryWatchers = new Set();
		addWatchersToSet(this.watchers, directoryWatchers);
		const map = new Map();
		for (const w of directoryWatchers) {
			const times = w.getTimeInfoEntries();
			for (const [path, entry] of times) {
				if (map.has(path)) {
					if (entry === EXISTANCE_ONLY_TIME_ENTRY) continue;
					const value = map.get(path);
					if (value === entry) continue;
					if (value !== EXISTANCE_ONLY_TIME_ENTRY) {
						map.set(path, Object.assign({}, value, entry));
						continue;
					}
				}
				map.set(path, entry);
			}
		}
		return map;
	}

	_missingWatcher(file, watcher) {
		if (watcher) {
			watcher.on("change", (mtime, type) => {
				this._onChange(file, mtime, file, type);
			});
			watcher.on("remove", type => {
				this._onRemove(file, file, type);
			});
		}
		return watcher;
	}

	_fileWatcher(file, watcher) {
		if (watcher) {
			watcher.on("initial-missing", type => {
				this._onRemove(file, file, type);
			});
			watcher.on("change", (mtime, type) => {
				this._onChange(file, mtime, file, type);
			});
			watcher.on("remove", type => {
				this._onRemove(file, file, type);
			});
		}
		return watcher;
	}

	_dirWatcher(item, watcher) {
		watcher.on("initial-missing", type => {
			this._onRemove(item, item, type);
		});
		watcher.on("change", (file, mtime, type) => {
			this._onChange(item, mtime, file, type);
		});
		watcher.on("remove", type => {
			this._onRemove(item, item, type);
		});
		return watcher;
	}

	_onChange(item, mtime, file, type) {
		file = file || item;
		if (this.paused) return;
		this.emit("change", file, mtime, type);
		if (this.aggregateTimeout) clearTimeout(this.aggregateTimeout);
		this.aggregatedRemovals.delete(item);
		this.aggregatedChanges.add(item);
		this.aggregateTimeout = setTimeout(
			this._onTimeout,
			this.options.aggregateTimeout
		);
	}

	_onRemove(item, file, type) {
		file = file || item;
		if (this.paused) return;
		this.emit("remove", file, type);
		if (this.aggregateTimeout) clearTimeout(this.aggregateTimeout);
		this.aggregatedChanges.delete(item);
		this.aggregatedRemovals.add(item);
		this.aggregateTimeout = setTimeout(
			this._onTimeout,
			this.options.aggregateTimeout
		);
	}

	_onTimeout() {
		this.aggregateTimeout = 0;
		const changes = this.aggregatedChanges;
		const removals = this.aggregatedRemovals;
		this.aggregatedChanges = new Set();
		this.aggregatedRemovals = new Set();
		this.emit("aggregated", changes, removals);
	}
}

module.exports = Watchpack;
