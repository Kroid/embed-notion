const dashIDLen = "0eeee000-cccc-bbbb-aaaa-123450000000".length;
const noDashIDLen = "0eeee000ccccbbbbaaaa123450000000".length;

module.exports.isValidDashID = (str) => {
  if (str.length !== dashIDLen) {
    return false;
  }

  if (str.indexOf("-") === -1) {
    return false;
  }

  return true;
};

module.exports.toDashID = (str) => {
  if (module.exports.isValidDashID(str)) {
    return str;
  }

  const s = str.replace(/-/g, "");

  if (s.length !== noDashIDLen) {
    return str;
  }

  const res =
    str.substring(0, 8) +
    "-" +
    str.substring(8, 12) +
    "-" +
    str.substring(12, 16) +
    "-" +
    str.substring(16, 20) +
    "-" +
    str.substring(20);
  return res;
};

module.exports.getBlockValue = (notionAgent, blockId) => {
  return notionAgent
    .getRecordValues({
      requests: [{ id: module.exports.toDashID(blockId), table: "block" }],
    })
    .then((resp) => {
      return resp.results[0].value.properties.title[0][0];
    });
};
