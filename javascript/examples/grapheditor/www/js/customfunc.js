/**
 * 
 * graph初始化后，开始注册自定义的一些方法，通过这些方法控制graph中的cell原件的展示属性。
 * 
 * 
 */

class graphx {
    constructor() {
        this.graph = window.graph
    }

    //通过id获取cell
    getCell(id) {
        this.graph.model.cells[id]
        return this.graph.model.cells[id]
    }

    //换cell的背景颜色
    setFillColor(cell, color) {
        let s = cell.style.split(';')
        s = s.map(kv => {
            if (kv.indexOf('fillColor') > -1) {
                kv = 'fillColor=' + color
            }
            return kv
        }).join(';')
        if (s.indexOf('fillColor') == -1) {
            s = s + ';fillColor=' + color
        }
        cell.style = s
        this.graph.refresh(cell)
    }

    //换cell的边框颜色
    setStrokeColor(cell, color) {
        let s = cell.style.split(';')
        s = s.map(kv => {
            if (kv.indexOf('strokeColor') > -1) {
                kv = 'strokeColor=' + color
            }
            return kv
        }).join(';')
        if (s.indexOf('strokeColor') == -1) {
            s = s + ';strokeColor=' + color
        }
        cell.style = s
        this.graph.refresh(cell)
    }
}

/**
 * 
 * 拓展一个cell的方法，遍历获取cell下级的cell,
 * 
 * 
 */

mxCell.prototype.getSubCell = function (name) {

    if (this.children) {

        let loop = cells => {
            let cell = null
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].children) {
                    cell = loop(cells[i].children)
                } else if (cells[i].getAttribute('name') == name) {
                    cell = cells[i]
                    break;
                }
            }
            return cell
        }
        return loop(this.children)

    } else {
        return null
    }

}