const fs = require('fs');
const _ = require('lodash');
const pluralize = require('pluralize');

function writeJson(jsonPath, data) {
  let file;

  try {
    file = fs.writeFileSync(jsonPath, JSON.stringify(data), {encoding: 'utf-8'});
  } catch (err) {
    file = false;
  }

  return file;
}

function setRelation(data, result, item, model, index) {
  let s_model = pluralize.singular(model);
  if (data[item] === undefined || data[item] === null) {
    result[model][index][item] = null;
  } else {
    if (typeof result[model][index][item] === 'string') {
      result[model][index][item] = [];
    }
    for (let i = 0, n = 0; i < data[item].length; i++) {
      if (typeof result[item][i][s_model] === 'string') {
        delete data[item][i][s_model];
        result[model][index][item].push(JSON.parse(JSON.stringify(data[item][i])));
        delete data[model][index][item];
        result[item][i][s_model] = JSON.parse(JSON.stringify(data[model][index]));
        n += 1;
      }

      if (n > 1) break;
    }
  }
  return result;
}

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

  sendToJson: function(attrs, inserts, replace, jsonPath, modelName) {
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
        } else {
          value = 'relation-' + item.type; // preparing to potential relationship
        }
        data[i][item.name] = value;
      });
    }

    // get name of root object
    let name = modelName.split('/');
    let result = {};
    let file;
    name = name[name.length - 1].split('.')[0];

    if (pluralize.isSingular(name)) name = pluralize.plural(name);

    try {
      file = fs.readFileSync(jsonPath, {encoding: 'utf-8'});
    } catch (err) {
      file = false;
    }
    if (file) result = JSON.parse(file);

    if (!result[name]) result[name] = [];

    if (replace) {
      result[name] = data;
    } else {
      result[name].push.apply(result[name], data);
    }
    writeJson(jsonPath, result);
  },

  clearFile: function(jsonPath) {
    fs.writeFile(jsonPath, '', 'utf-8', function(err) {
      if (err) throw err;
    });
  },

  makeRelationship: function(jsonPath) {
    let data, result, itemName, aux;
    try {
      data = fs.readFileSync(jsonPath, {encoding: 'utf-8'});
      data = JSON.parse(data);
    } catch (err) {
      throw err;
    }

    result = JSON.parse(JSON.stringify(data));
    for (let model in data) {
      if (data.hasOwnProperty(model)) {
        for (let i = 0; i < data[model].length; i++) {
          for (let attr in data[model][i]) {
            if (data[model][i].hasOwnProperty(attr) && typeof data[model][i][attr] == 'string') {
              aux = data[model][i][attr].split('-');
              if (aux[0] == 'relation') {
                if (aux[1].slice(-2) == '[]') {
                  itemName = aux[1].slice(0, -2).toLowerCase();
                  if (pluralize.isSingular(itemName)) itemName = pluralize.plural(itemName);
                  result = setRelation(data, result, itemName, model, i);
                } else {
                  itemName = aux[1].toLowerCase();
                  if (pluralize.isSingular(itemName)) itemName = pluralize.plural(itemName);
                  result = setRelation(data, result, model, itemName, i);
                }
              }
            }
          }
        }
      }
    }

    writeJson(jsonPath, result);
  }
}
