import axios from 'axios'

const deflateList = (ids) => {
    if (Array.isArray(ids) === false || ids.length === 0) {
        return ''
    }

    const sortedIds = ids.slice().sort( (a, b) => {
        return a - b
    })

    let id = sortedIds.shift()
    let num10 = 0
    let result = ''
    let digit = 0

    for (;;) {
        if (id <= ((digit + 1) * 10)) {
            num10 += 1 << (id - (10 * digit) - 1)

            if (sortedIds.length === 0) {
                result += encode(num10)
                break
            } else {
                id = sortedIds.shift()
            }
        } else {
            result += encode(num10)
            num10 = 0
            digit++
        }
    }

    return result
}

const encode = (number) => {
    return getEncodedChar(Math.floor(number / 62)) + getEncodedChar(number % 62)
}

const decode = (number62) => {
    // 62進数なので、2桁目は結果に62を掛けた上で、1桁目とそのまま加算する
    return getDecodedChar(number62.substr(0, 1)) * 62 + getDecodedChar(number62.substr(1, 1))
}

const charTable = () => {
    const values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        .concat(
            [...Array(26).keys()].map(i => String.fromCharCode(i + 97)),
            [...Array(26).keys()].map(i => String.fromCharCode(i + 65))
        )

    return values.map(value => {
        return value.toString()
    })
}

const getEncodedChar = (number) => {
    const table = charTable()

    return table[number]
}

const getDecodedChar = (number62) => {
    const table = charTable()

    return table.findIndex(value => {
        return value === number62
    })
}

const base64encodeUrl = (number64String) => {
    return btoa(number64String)
        .replace(/\+/g, '_')
        .replace(/\//g, '-')
        .replace(/=/g, '.')
}

const base64decodeUrl = (value) => {
    return atob(value
        .replace(/\./g, '=')
        .replace(/-/g, '/')
        .replace(/_/g, '+')
    )
}

const inflateList = (paramString) => {
    let selectedIds = []

    paramString.split(/([0-9a-zA-Z]{2})/).filter(e => {
        // 空白を消す
        return e
    }).forEach( (value, index) => {
        let number = decode(value)

        for (let i = 9; i >= 0; i--) {
            const check = 1 << i;

            if (check <= number) {
                number -= check
                selectedIds.push((index * 10) + (i + 1))
            }
        }
    })

    // ソートして返す
    return selectedIds.sort( (a, b) => {
        return a - b
    })
}

const getCharacterData = () => {
    return new Promise( (resolve, reject) => {
        axios.get('characters.csv?update=20200614')
            .then( response => {
                const charactersData = response.data.split('\n')

                let columnSettings = charactersData.shift().split(',')
                columnSettings = columnSettings.map(columnSetting => {
                    const setting = columnSetting.split(':')
                    return {
                        name: setting[0],
                        type: setting[1],
                    }
                })

                let characters = []
                charactersData.forEach((characterRow) => {
                    let characterObject = {}
                    const characterRowValues = characterRow.split(',')
                    characterRowValues.forEach((characterData, columnIndex) => {
                        characterObject[columnSettings[columnIndex].name] = columnSettings[columnIndex].type === 'Number' ? Number(characterData) : characterData
                    })
                    characters.push(characterObject)
                })

                resolve(characters)
            })
            .catch( () => {
                reject(`キャラクターデータの初期化に失敗しました`)
            })
    })
}

const convertHiraToKana = (text) => {
    return text.replace(/[ぁ-ん]/g, s => {
        return String.fromCharCode(s.charCodeAt(0) + 0x60)
    })
}

export default {
    deflateList,
    inflateList,
    base64encodeUrl,
    base64decodeUrl,
    getCharacterData,
    convertHiraToKana,
}