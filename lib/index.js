const fs = require('fs');
const _ = require('lodash');

module.exports = {
  modelToArray: function(filePath) {
    try {
      data = fs.readFileSync(filePath, {encoding: 'utf-8'});
    } catch (err) {
      throw err;
    }
    let flag = -1;
    let attrs = [];
    let index = 0;
    attrs[index] = {};
    attrs[index].name = '';
    attrs[index].type = '';
    _.forEach(data, function (item) {
      if (item !== '' &&
          item !== '\n' &&
          item !== undefined &&
          item !== ':' &&
          item !== '}' &&
          item !== ';' &&
          item !== ' ') {
        if (flag === 0) attrs[index].name += item;
        else if (flag === 1) attrs[index].type += item;
      }
      switch(item) {
        case '{':
          flag = 0;
          break;
        case ':':
          flag = 1;
          break;
        case ';':
          flag = 0;
          index += 1;
          attrs[index] = {};
          attrs[index].name = '';
          attrs[index].type = '';
          break;
        case '}':
          flag = 2;
          break;
      }
    });
    attrs.splice(index, 1);

    return attrs;
  },

  sendToJson: function(attrs, inserts, clean, dbPath) {
    let data = [];
    let obj = {}
    let value = null;

    for(let i = 0; i < inserts; i++) {
      data[i] = {};
      _.forEach(attrs, function (item) {
        if (item.type === 'string') {
          value = item.name.substr(0, 5) + '-' + Math.random().toString(36).substr(2, 5);
        } else if (item.type === 'number') {
          value = Math.floor(Math.random() * (1000 - 1) + 1);
        }
        data[i][item.name] = value;
      });
    }

    if (clean) {
      fs.writeFile(dbPath, JSON.stringify(data), 'utf-8', function(err) {
        if (err) throw err;
      });
    } else {
      fs.appendFile(dbPath, JSON.stringify(data), 'utf-8', function (err) {
        if (err) throw err;
      });
    }
  }
}

