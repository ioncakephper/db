const index = require("../index")

// @ponicode
describe("index.DB.buildSelectColumnsClause", () => {
    test("0", () => {
        let result = index.DB.buildSelectColumnsClause(undefined)
        expect(result).toBe("*")
    })

    test("1", () => {
        let result = index.DB.buildSelectColumnsClause({ columns: ["name "] })
        expect(result).toBe("name")
    })

    test("2", () => {
        let result = index.DB.buildSelectColumnsClause({ columns: ["name  alias "] })
        expect(result).toBe("name alias")
    })

    test("3", () => {
        let result = index.DB.buildSelectColumnsClause({ columns: ["name  alias ", "  name  alias "] })
        expect(result).toBe("name alias, name alias")
    })

    test("4", () => {
        let object = [{ name: "name" }, { name: "name", alias: "alias" }]
        let result = index.DB.buildSelectColumnsClause({ columns: object })
        expect(result).toBe("name, name alias")
    })

    test("5", () => {
        let object = [{ name: "" }, { name: "name", alias: "alias" }]
        let callFunction = () => {
            index.DB.buildSelectColumnsClause({ columns: object })
        }
    
        expect(callFunction).toThrow('Column description has no name property or name property is empty: {"name":""}')
    })

    test("6", () => {
        let object = [{ name: "name" }, { alias: "alias" }]
        let callFunction = () => {
            index.DB.buildSelectColumnsClause({ columns: object })
        }
    
        expect(callFunction).toThrow('Column description has no name property or name property is empty: {"alias":"alias"}')
    })

    test("7", () => {
        let object = [[1, 2, 3]]
        let callFunction = () => {
            index.DB.buildSelectColumnsClause({ columns: object })
        }
    
        expect(callFunction).toThrow('Column description is neither string nor object: [1,2,3]')
    })
})

// @ponicode
describe("index.DB.buildSelectFromClause", () => {
    test("0", () => {
        let callFunction = () => {
            index.DB.buildSelectFromClause(undefined)
        }
    
        expect(callFunction).toThrow('Table description has no name property or name property is empty: {}')
    })

    test("1", () => {
        let result = index.DB.buildSelectFromClause({ table: "tn" })
        expect(result).toBe("FROM tn")
    })

    test("2", () => {
        let result = index.DB.buildSelectFromClause({ table: "tn ta" })
        expect(result).toBe("FROM tn ta")
    })

    test("3", () => {
        let callFunction = () => {
            index.DB.buildSelectFromClause({ table: { alias: "" } })
        }
    
        expect(callFunction).toThrow('Table description has no name property or name property is empty: {"alias":""}')
    })

    test("4", () => {
        let result = index.DB.buildSelectFromClause({ table: { name: "  tn  " } })
        expect(result).toBe("FROM   tn")
    })

    test("5", () => {
        let result = index.DB.buildSelectFromClause({ table: { name: "  tn  ", alias: " ta  " } })
        expect(result).toBe("FROM   tn    ta")
    })
})

// @ponicode
describe("index.DB.buildSelectLimitClause", () => {
    test("0", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [] })
        expect(result).toBe("LIMIT 0")
    })

    test("1", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [5] })
        expect(result).toBe("LIMIT 5")
    })

    test("2", () => {
        let result = index.DB.buildSelectLimitClause({ limit: [5, 10] })
        expect(result).toBe("LIMIT 5, 10")
    })

    test("3", () => {
        let result = index.DB.buildSelectLimitClause(undefined)
        expect(result).toBe("LIMIT 0")
    })

    test("4", () => {
        let result = index.DB.buildSelectLimitClause({})
        expect(result).toBe("LIMIT 0")
    })

    test("5", () => {
        let callFunction = () => {
            index.DB.buildSelectLimitClause({ limit: {} })
        }
    
        expect(callFunction).toThrow('Limit description is not an array: {}')
    })

    test("6", () => {
        let callFunction = () => {
            index.DB.buildSelectLimitClause({ limit: 5 })
        }
    
        expect(callFunction).toThrow('Limit description is not an array: 5')
    })

    test("7", () => {
        let callFunction = () => {
            index.DB.buildSelectLimitClause({ limit: "5" })
        }
    
        expect(callFunction).toThrow('Limit description is not an array: "5"')
    })
})

// @ponicode
describe("index.DB.buildSelectStatement", () => {
    test("0", () => {
        let callFunction = () => {
            index.DB.buildSelectStatement(undefined)
        }
    
        expect(callFunction).toThrow('Table description has no name property or name property is empty: {}')
    })

    test("1", () => {
        let callFunction = () => {
            index.DB.buildSelectStatement({})
        }
    
        expect(callFunction).toThrow('Table description has no name property or name property is empty: {}')
    })

    test("2", () => {
        let result = index.DB.buildSelectStatement({ table: "tn" })
        expect(result).toBe("SELECT * FROM tn WHERE ( 1 ) LIMIT 0")
    })

    test("3", () => {
        let result = index.DB.buildSelectStatement({ table: "tn", limit: [0, 100] })
        expect(result).toBe("SELECT * FROM tn WHERE ( 1 ) LIMIT 0, 100")
    })

    test("5", () => {
        let result = index.DB.buildSelectStatement({ table: "tn", limit: [] })
        expect(result).toBe("SELECT * FROM tn WHERE ( 1 ) LIMIT 0")
    })
})
