function isDependencyInstalled(dependency) {
  try {
    require.resolve(dependency);
    return true;
  } catch (err) {
    return false;
  }
}
module.exports = isDependencyInstalled;
