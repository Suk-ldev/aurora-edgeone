/**
 * defination: new Enum({
 *    MAN: [1, '男'],
 *    WOMAN: [2, '女']
 * })
 */
class Enum {
  constructor(defination) {
    this.defination = defination
    this.parseDefination()
  }

  parseDefination() {
    Object.keys(this.defination).forEach((key) => {
      this[key] = this.defination[key][0]
    })
  }

  toArray() {
    const ret = Object.keys(this.defination).map((key) => {
      const item = this.defination[key]
      return {
        value: item[0],
        label: item[1]
      }
    })
    return ret
  }

  getLabel(value) {
    return this.toArray().find((item) => String(item.value) === String(value))?.label ?? ''
  }
}

export default Enum
