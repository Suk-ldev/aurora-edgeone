import i18n from '@/i18n'

export const planTypes = [
  { key: 'month_price', label: i18n.t('monthly_2'), label2: i18n.t('monthly') },
  { key: 'quarter_price', label: i18n.t('quarterly_2'), label2: i18n.t('quarterly') },
  { key: 'half_year_price', label: i18n.t('semiannual'), label2: i18n.t('half_year') },
  { key: 'year_price', label: i18n.t('annual'), label2: i18n.t('one_year') },
  { key: 'two_year_price', label: i18n.t('biannual'), label2: i18n.t('two_year') },
  { key: 'three_year_price', label: i18n.t('triennial'), label2: i18n.t('three_year') },
  { key: 'onetime_price', label: i18n.t('one_time'), label2: i18n.t('one_time_payment') }
]

/**
 * 根据套餐数据计算价格显示
 * @param {Object} plan 套餐对象
 * @returns
 */
export function getShowPrice(plan) {
  const types = planTypes.filter((item) => plan[item.key] !== null)

  let jsonArray = null
  let matchTagText = ''
  try {
    jsonArray = JSON.parse(plan.content)
  } catch {}

  if (jsonArray) {
    // 说明是json字符串
    const labelObj = jsonArray.find((_) => _.label)?.label
    // console.log(labelObj)
    if (labelObj) {
      matchTagText = `<div class="t0" style="color: ${labelObj.textColor}; background-color: ${labelObj.background}">${labelObj.text}</div>`
    }
  } else {
    // 说明是html字符串
    matchTagText = /<div\s+class="t0.*?".*?>(.*)<\/div>/gi.exec(plan.content)?.[0]
  }
  // matchTagText 是带标签的富文本，匹配出来后，用css隐藏content中写的t0
  // console.log('matchTagText', matchTagText)
  const getTagTitle = () => {
    if (matchTagText) {
      return matchTagText
    }
    if (plan.capacity_limit !== null) {
      if (plan.capacity_limit < 10) {
        if (plan.capacity_limit <= 0) {
          return `<div class="t0">${i18n.t('sold_out')}</div>`
        }
        return `<div class="t0">${i18n.t('almost_sold_out')}</div>`
      }
    }
    return ''
  }

  const tagTitle = getTagTitle()

  return {
    types,
    value: plan[types[0].key], // 取第一个
    label: types[0].label,
    label2: types[0].label2,
    tagTitle
  }
}

/**
 * 根据套餐数据计算显示的套餐内容（因为现在有html格式和json格式）
 * @param {Object} plan 套餐对象
 * @returns
 */
export function getShowContent(plan) {
  let jsonArray = null
  try {
    jsonArray = JSON.parse(plan.content)
  } catch {}

  if (jsonArray) {
    // 说明是json字符串
    const features = jsonArray.filter((_) => _.feature)
    return features
      .map((item) => {
        return `
        <div class="t4">
          <div class="desc">
            <i class="${item.support ? 'gou' : 'cha'}"></i>
            ${item.feature}
          </div>
        </div>
      `
      })
      .join('')
  } else {
    // 说明是html字符串
    return plan.content
  }
}
