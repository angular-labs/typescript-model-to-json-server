const fs = require('fs');
const _ = require('lodash');

module.exports = {
  modelToArray: function(modelPath) {
    let data;
    try {
      data = fs.readFileSync(modelPath, {encoding: 'utf-8'});
    } catch (err) {
      throw err;
    }
    let flag = -1;
    let attrs = [];
    let index = 0;
    let lines = data.split('\n');
    let start = false;
    attrs[index] = {};
    attrs[index].name = '';
    attrs[index].type = '';

    _.forEach(lines, function (line) {
      if (line.includes('interface')) {
        start = true;
      }
      if (start) {
        _.forEach(line, function (item) {
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
      }
    });
    attrs.splice(index, 1);

    return attrs;
  },

  sendToJson: function(attrs, inserts, clean, jsonPath, modelName) {
    let data = [];
    let value = null;

    for(let i = 0; i < inserts; i++) {
      data[i] = {};
      _.forEach(attrs, function (item) {
        value = null;
        if (item.type === 'string') {
          value = item.name.substr(0, 5) + '-' + Math.random().toString(36).substr(2, 5);
        } else if (item.type === 'number') {
          value = Math.floor(Math.random() * (1000 - 1) + 1);
        } else if (item.type === 'Date') {
          value = Date.now().toString();
        }
        data[i][item.name] = value;
      });
    }

    // get name of root object
    let name = modelName.split('/');
    let result = {};
    let file;
    name = name[name.length - 1].split('.')[0];
    if (name[name.length - 1] !== 's') {
      name += 's';
    }

    try {
      file = fs.readFileSync(jsonPath, {encoding: 'utf-8'});
    } catch (err) {
      file = false;
    }
    if (!clean && file) {
      result = JSON.parse(file);
      if (!result[name]) {
        result[name] = [];
      }
      result[name].push.apply(result[name], data);
    } else {
      result[name] = data;
    }
    fs.writeFile(jsonPath, JSON.stringify(result), 'utf-8', function(err) {
      if (err) throw err;
    });
  }
}
