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

    //通过鼠标位置获取cell,包括组
    // graph.getCellAt(3111,2877)
    //通过id获取cell
    getEquip(uid) {
        return window.parkequip[uid]
    }

    /***
     * 
     * 
     * 设置道岔的状态
     * 
     * 
     */

    setTurnoutStatus(uid, status) {
        let cell = this.getEquip(uid)

        //初始化零件的闪烁状态为不闪烁
        if (!cell.partvisible) {
            cell.partvisible = {}
        }
        cell.partvisible['reverse'] = false
        cell.partvisible['direct'] = false
        cell.partvisible['label'] = false
        cell.partvisible['boundary'] = false

        //获取零件
        let reverseroad = cell.getSubCell('reverse')
        let directroad = cell.getSubCell('direct')
        let namelabel = cell.getSubCell('label')
        let boundary = cell.getSubCell('boundary')


        if (!boundary) {
            //获取direct的坐标作为参考,创建一个圆形边框
            let referenceposition = cell.getSubCell('direct').geometry
            let boundaryvalue = cell.getSubCell('direct').value.cloneNode(true)
            boundaryvalue.setAttribute('name', 'boundary')
            let newboundary = this.graph.insertVertex(cell, null, '', referenceposition.x, referenceposition.y, 22, 22, "shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=red;fillColor=none;fontFamily=Verdana;fontSize=14;fontColor=#FFFFFF;movable=1;resizable=1;rotatable=1;deletable=1;editable=1;connectable=1;cursor=pointer;");
            newboundary.value = boundaryvalue
            boundary = newboundary
        }

        //根据状态设置零件的闪烁
        //取消闪烁时，设置部件的partvisible为false
        //cell.partvisible['boundary'] = false
        this.flashcell(boundary)


        this.graph.refresh(cell)
    }

    //设置零件闪烁
    flashcell(cell) {

        cell.parent.partvisible[cell.getAttribute('name')] = true
        let func = i => {
            console.log(cell)
            if (cell.parent.partvisible[cell.getAttribute('name')]) {
                cell.visible = !cell.visible
                this.graph.refresh(cell)
                setTimeout(func, 500)
            }
        }
        func()

    }

    //换label的文字html
    //this.setLabelText(namelabel,`<div style="background:red;color:white;">hahahha</div>`)
    setLabelText(cell, code) {
        cell.value.setAttribute('label', code)
        this.graph.refresh(cell)
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