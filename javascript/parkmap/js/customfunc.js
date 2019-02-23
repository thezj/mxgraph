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

    setTurnoutStatus(uid, status, replenish, sectorstatus) {
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
        let reverse = cell.getSubCell('reverse')
        let direct = cell.getSubCell('direct')
        let roadreverse = cell.getSubCell('road-reverse')
        let roaddirect = cell.getSubCell('road-direct')
        let roadentrance = cell.getSubCell('road-entrance')
        let namelabel = cell.getSubCell('label')
        let boundary = cell.getSubCell('boundary')
        //初始化零件显示
        let allparts = [reverse, direct, roadreverse, roaddirect, roadentrance]
        allparts.map(a => {
            a.map(i => this.setCellVisible(i, true) + this.setFillColor(i, '#00f'))
        })

        //初始化隐藏边框
        if (boundary.length) {
            boundary.map(i => {
                this.setCellVisible(i, false)
            })
        }
        namelabel.map(i => this.setLabelText(i, `<div style="background:none;color:#fff;">${uid}</div>`))
        /**
         * 
        1、绿色稳定显示：表示道岔此时处于定位位置；如图：
        2、黄色稳定显示：表示道岔此时处于反位位置；如图：
        3、黑色稳定显示：表示道岔刚失去表示，失去表示时间未超过允许失去表示的规定时间（非特殊道岔，一般情况为30秒）；如图：
        4、红色闪烁显示：表示道岔已失去表示超过允许失去表示的规定时间（非特殊道岔，一般情况为30秒），此时道岔处于挤岔报警状态，需要电务人员进行故障处理；如图：
        5、岔尖处有红色圆圈显示：标识道岔此时处于单锁状态、防护锁状态或引导总锁闭状态。如图：
         * 
         */

        switch (status) {
            case 0:
                direct.map(i => this.setFillColor(i, '#0f0'))
                reverse.map(i => this.setCellVisible(i, false))
                namelabel.map(i => this.setLabelText(i, `<div style="background:none;color:#0f0;">${uid}</div>`))
                break
            case 1:
                reverse.map(i => this.setFillColor(i, '#ff0'))
                direct.map(i => this.setCellVisible(i, false))
                namelabel.map(i => this.setLabelText(i, `<div style="background:none;color:#ff0;">${uid}</div>`))
                break
            case 2:
                reverse.map(i => this.setCellVisible(i, false))
                direct.map(i => this.setCellVisible(i, false))
                namelabel.map(i => this.setLabelText(i, `<div style="background:none;color:#f00;">${uid}</div>`))
                break
            case 3:
                reverse.map(i => this.setFillColor(i, '#f00'))
                direct.map(i => this.setFillColor(i, '#f00'))
                namelabel.map(i => this.setLabelText(i, `<div style="background:none;color:#f00;">${uid}</div>`))
                break
        }

        //加边框显示
        if (replenish) {
            if (!boundary.length) {
                //获取direct的坐标作为参考,创建一个圆形边框
                let referenceposition = cell.getSubCell('direct')[0].geometry
                let boundaryvalue = cell.getSubCell('direct')[0].value.cloneNode(true)
                boundaryvalue.setAttribute('name', 'boundary')
                let newboundary = this.graph.insertVertex(cell, null, '', referenceposition.x - 2, referenceposition.y - 5, 25, 25, "shape=ellipse;whiteSpace=wrap;html=1;aspect=fixed;strokeColor=red;fillColor=none;fontFamily=Verdana;fontSize=14;fontColor=#FFFFFF;movable=1;resizable=1;rotatable=1;deletable=1;editable=1;connectable=1;cursor=pointer;");
                newboundary.value = boundaryvalue
                boundary.push(newboundary)
            } else {
                boundary.map(i => this.setCellVisible(i, true))
            }
        }

        if (sectorstatus !== undefined) {

            /**
             * 
            1、浅蓝色光带：道岔所在的轨道区段处于空闲解锁状态；
            2、白色光带：道岔所在的轨道区段处于空闲锁闭状态；
            3、红色光带：道岔所在的轨道区段处于占用或轨道电路故障；
            4、在原有区段状态上下增加粉红色线框的光带：表示道岔所在区段被人工设置了轨道电路分路不良标记，此标记仅为人工显示的标记，不含任何联锁关系。
             * 
             */
            let a = [roadreverse, roaddirect, roadentrance, reverse, direct]
            if (status == 0) {
                a = [roaddirect, roadentrance, direct]
            } else if (status == 1) {
                a = [roadreverse, roadentrance, reverse]
            }
            switch (sectorstatus) {
                case 0:
                    a.map(ip => {
                        ip.map(i => {
                            this.setFillColor(i, '#00f')
                        })
                    })
                    break
                case 1:
                    a.map(ip => {
                        ip.map(i => {
                            this.setFillColor(i, '#fff')
                        })
                    })
                    break
                case 2:
                    a.map(ip => {
                        ip.map(i => {
                            this.setFillColor(i, '#f00')
                        })
                    })
                    break
            }
        }


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

    //设置零件闪烁fillcolor
    flashcellcolor(cell, c1, c2) {
        let randomkey = 'randomkey' + Math.floor(Math.random() * 10000000)
        window[randomkey] = 0

        cell.parent.partvisible[cell.getAttribute('name')] = true
        let func = i => {
            console.log(cell)
            if (cell.parent.partvisible[cell.getAttribute('name')]) {
                if (window[randomkey]) {
                    this.setFillColor(cell, c1)
                } else {
                    this.setFillColor(cell, c2)
                }
                window[randomkey] = !window[randomkey]
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

    //设置cell的隐藏显示
    setCellVisible(cell, key) {
        cell.visible = key
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
