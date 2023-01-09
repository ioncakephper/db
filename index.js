
const {isString, isArray, isObject, isEmpty} = require('lodash')

/**
 * @typedef {object} DbResult
 * @property {Array<string>} fields - the fields returned.
 * @property {Array<object>} records - the records returned.
 */

/**
 * A class that handles the database.
 */
class DB {

  /**
   * Executes the given JavaScript code.
   * @param {string} statement - the JavaScript code to execute.
   * @returns {DbResult} the result of executing the statement.
   */
  static execute(statement = '') {
    return {
      fields: ['COUNT'],
      records: [{COUNT: 1}]
    }
  }

  /**
   * Selects data from the database.
   * @param {object} options - the options to select with.
   * @returns {Promise<object>} - the data selected.
   */
  static select(options = {}) {
    let statement = DB.buildSelectStatement(options)
    return DB.execute(statement)
  }

  static buildSelectStatement(options = {}) {

    let {
      columnsClause,
      fromClause,
      whereClause,
      limitClause,
    } = DB.buildSelectStatementClauses(options)

    return `SELECT ${columnsClause} ${fromClause} ${whereClause} ${limitClause}`.trim()
  }

  /**
   * Builds a SQL WHERE clause for the given options.
   * @param {object} options - the options to build the WHERE clause with.
   * @returns {string} the SQL WHERE clause.
   */
  static  buildSelectWhereClause(options = {}) {
    let {conditions} = options;
    return `WHERE ( 1 )`
  }

  /**
   * Builds a SQL LIMIT clause from the given options.
   * @param {Object} options - the options to build the LIMIT clause from.
   * @param {number[]} [options.limit] - the limit to apply to the query.
   * @returns {string} the SQL LIMIT clause.
   * @throws Limit description is not an array.
   */
  static buildSelectLimitClause(options = {}) {
    let {limit = []} = options;
    if (!isArray(limit)) {
      throw new Error(`Limit description is not an array: ${JSON.stringify(limit)}`)
    }
    let [offset = 0, count] = limit;
    return `LIMIT ${offset}` + ((count) ? `, ${count}` : '')
  }

  /**
   * Builds the clauses for a select statement.
   * @param {object} options - the options to build the select clause with.
   * @returns {object} the clauses for select statement.
   */
  static buildSelectStatementClauses(options = {}) {
    return {
      columnsClause: DB.buildSelectColumnsClause(options),
      fromClause: DB.buildSelectFromClause(options),
      whereClause: DB.buildSelectWhereClause(options),
      limitClause: DB.buildSelectLimitClause(options),
    }
  }

  /**
   * Builds FROM clause from the given options.
   * @param {object} [options = {}] - the options to build FROM clause from.
   * @param {string | object} options.table - The table to select from.
   * @param {string} options.table.name - the table to create the from clause for.
   * @param {string} [options.table.alias = ''] - the alias of the table to create the from clause for.
   * @returns {string} The FROM clause.
   * @throws Table description is neither string nor object.
   * @throws Table description has no name property or name property is empty.
   */
  static buildSelectFromClause(options = {}) {
    let {table = {}} = options;
    if (isString(table)) {
      let [name, alias] = table.trim().split(/\s+/);
      table = {
        name,
        alias
      }
    }
    if (isArray(table)) {
      throw new Error(`Table description is neither string nor object: ${JSON.stringify(table)}`)
    }
    if (isObject(table)) {
      let {name, alias} = table;
      let isNameValid = isString(name) && !isEmpty(name.trim());
      if (!isNameValid) {
        throw new Error(`Table description has no name property or name property is empty: ${JSON.stringify(table)}`)
      }
      return `FROM ${name} ${alias || ''}`.trim()
    }
  }

  /**
   * Builds a columns clause for the given list of columns.
   * @param {Array<string | {name: string, alias: string}>} columns - the columns to select.
   * @returns {string} the columns clause.
   * @throws Column description is neither string nor object.
   * @throws Column description has no name property or name property is empty.
   */
  static buildSelectColumnsClause(options = {}) {
    let {columns = ['*']} = options
    let cols = columns.map(column => {
      if (isString(column)) {
        let [name, alias] = column.trim().split(/\s+/);
        column = {
          name,
          alias
        }
      }
      if (isArray(column)) {
        throw new Error(`Column description is neither string nor object: ${JSON.stringify(column)}`)
      }
      if (isObject(column)) {
        let {name, alias} = column;
        let isNameValid = isString(name) && !isEmpty(name.trim());
        if (!isNameValid) {
          throw new Error(`Column description has no name property or name property is empty: ${JSON.stringify(column)}`)
        }
        return `${name} ${alias || ''}`.trim()
      }
    })
    return cols.join(', ')
  }
}

module.exports = {
  DB,
}
