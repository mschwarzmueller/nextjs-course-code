import { webpack } from 'next/dist/compiled/webpack/webpack';
export default class ChunkNamesPlugin {
    apply(compiler: webpack.Compiler): void;
}
