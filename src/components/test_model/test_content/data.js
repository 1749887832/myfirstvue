const argument_type = [
    {
        value: 'int',
        label: '整型'
    },
    {
        value: 'float',
        label: '浮点型'
    },
    {
        value: 'str',
        label: '字符串',
    }
]
const chose_options =  [{
        value: 'equal',
        label: '等于'
    }, {
        value: 'not_equal',
        label: '不等于'
    }, {
        value: 'less',
        label: '小于'
    }, {
        value: 'greater',
        label: '大于'
    }, {
        value: 'less_equal',
        label: '小于等于'
    }, {
        value: 'greater_equal',
        label: '大于等于'
    }, {
        value: 'in_to',
        label: '包含'
    }, {
        value: 'not_in',
        label: '不包含'
    }]
export {
    argument_type,
    chose_options
}