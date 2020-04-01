const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const foreColor : string = "#3F51B5"
const backColor : string = "#212121"
const delay : number = 30
const sizeFactor : number = 2.9
const nodes : number = 5
const parts : number = 5

class ScaleUtil {

    static maxScale(scale : number, i : number, n :number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }
}

class DrawingUtil {

    static drawBarPart(context : CanvasRenderingContext2D, i : number,  scale : number, size : number, h : number) {
        const sci : number = ScaleUtil.divideScale(scale, i, parts)
        const initY : number = h / 6 + (i * size)
        const y : number = initY + (h - initY) * sci
        context.save()
        context.translate(0, y)
        context.fillRect(0, -size / 2, size, size)
        context.restore()
    }

    static drawBarParts(context : CanvasRenderingContext2D, scale : number, size : number, h : number) {
        for (var i = 0; i < parts; i++) {
            DrawingUtil.drawBarPart(context, i, scale, size, h)
        }
    }

    static drawLDPNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const gap : number = w / (nodes + 1)
        const size : number = gap / sizeFactor
        context.fillStyle = foreColor
        context.save()
        context.translate(gap * (i + 1), 0)
        DrawingUtil.drawBarParts(context, scale, size, h)
        context.restore()
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}
