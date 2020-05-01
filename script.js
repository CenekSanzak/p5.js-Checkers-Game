const squareLength = 40;
let turn = 1
let pieces = []
let strict =false
class Piece{
    constructor(i, j, type){
        this.i = +i
        this.j = +j
        this.type = type
        this.selected = false
        this.possibleMoves=[]
        this.isKing = false
    }
    select(){
        this.selected = true
    }
    getPossibleMoves(canEat){
        var response = []
        var i = this.i
        var j = this.j
        let piece;
        if((this.isKing ) || (!this.isKing && this.type === 2)){
            piece = pieces.find(p=>p.checkPiece(i-1,j+1))
            if(i !== 0 && j !== 7){
                if(piece === undefined){
                    if(!canEat)
                        response.push({i:i-1,j:j+1,eat:false})
                }
                else if(i!==1 && j!==6 && pieces.find(p=>p.checkPiece(i-2,j+2)) === undefined && piece.type !== this.type && piece.type !== this.type+2){
                    response.push({i:i-2,j:j+2,eat:piece})
                }
            }
            piece = pieces.find(p=>p.checkPiece(i+1,j+1))
            if(i !== 7 && j !== 7){
                if(piece === undefined){
                    if(!canEat)
                        response.push({i:i+1,j:j+1,eat:false})
                }
                else if(i!==6 && j!==6 && pieces.find(p=>p.checkPiece(i+2,j+2)) === undefined && piece.type !== this.type && piece.type !== this.type+2){
                    response.push({i:i+2,j:j+2,eat:piece})
                }
            }
        }
        if((this.isKing ) || (!this.isKing && this.type === 1)){
            piece = pieces.find(p=>p.checkPiece(i-1,j-1))
            if(i !== 0 && j !== 0){
                if(piece === undefined){
                    if(!canEat)
                        response.push({i:i-1,j:j-1,eat:false})
                }
                else if(i!==1 && j!==1 && pieces.find(p=>p.checkPiece(i-2,j-2)) === undefined && piece.type !== this.type && piece.type !== this.type+2){
                    response.push({i:i-2,j:j-2,eat:piece})
                }
            }
            piece = pieces.find(p=>p.checkPiece(i+1,j-1))
            if(i !== 7 && j !== 0){
                if(piece === undefined){
                    if(!canEat)
                        response.push({i:i+1,j:j-1,eat:false})
                }
                else if(i!==6 && j!==1 && pieces.find(p=>p.checkPiece(i+2,j-2)) === undefined && piece.type !== this.type && piece.type !== this.type+2){
                    response.push({i:i+2,j:j-2,eat:piece})
                }
            }

        }
        return response
    }
    checkPiece(i, j){
        return this.i===i && this.j===j
    }
    beKing(){
        this.isKing = true
    }
    move(i,j){
        let move = this.possibleMoves.find(m=>m.i===i&&m.j===j)
        if(!move)return
        this.i = i
        this.j = j
        if(this.j === 7 && this.type === 2)this.beKing()
        if(this.j === 0 && this.type === 1)this.beKing()
        pieces = pieces.filter(p=>p!==move.eat)
        if(!calculateMoves() || !move.eat){
            this.possibleMoves = []
            turn = turn === 1? 2:1
            this.selected = false
            strict = false
            calculateMoves()
        }
        else{
            strict = true
        }
    }
}
resetMoves = _=>pieces.forEach(p=>p.possibleMoves=[])
calculateMoves = _=>{
    let canEat = false
    pieces.forEach(p=>{
        p.possibleMoves=p.getPossibleMoves()
        p.possibleMoves.forEach(m => {if(m.eat && p.type === turn)canEat=true})
    })
    if(canEat) {
        pieces.forEach(p => {
            p.possibleMoves = p.getPossibleMoves(true)
        })
    }
    return canEat
}
function setup() {
    createCanvas(400, 400);
    for(var j = 0; j < 3; j++){
        for(var i = 0; i < 8; i++){
            if((i+j)%2===1){
                pieces.push(new Piece(i, j, 2))
                pieces.push(new Piece(7-i, 7-j, 1))
            }
        }
    }
    calculateMoves()
}


function draw() {
    background(220);
    drawBoard();
}
function mouseClicked(){
    if(mouseX < 40 || mouseX > 360 ||mouseY < 40 || mouseY > 360)return
    var i = floor((mouseX-40)/squareLength);
    var j = floor((mouseY-40)/squareLength);
    var clicked = pieces.find(p=> p.checkPiece(i,j) && p.type==turn)
    var selected = pieces.find(p=>p.selected)
    if(clicked && !strict){
        if(selected)selected.selected=false
        //console.log(clicked)
        clicked.select();
        return
    }
    if(selected){
        if(selected.possibleMoves.find(m=>m.i===i&&m.j===j) !== undefined){
            selected.move(i, j)
        }
    }
}
function drawBoard(){
    var selected = pieces.find(p=>p.selected)
    for(var i = 0; i < 8; i++){
        for(var j = 0; j < 8; j++){
            noStroke()
            if((i+j)%2===0){
                fill(0)
                square(40+i*squareLength,40+j*squareLength,squareLength)
            }
            else{
                fill(255,255,255)
                square(40+i*squareLength,40+j*squareLength,squareLength)
            }
            if(selected){
                fill(128,255,128)
                if(selected.possibleMoves.find(m=>m.i===i&&m.j===j) !== undefined)
                    square(40+i*squareLength,40+j*squareLength,squareLength)
            }
            drawElement(i ,j , 40+i*squareLength, 40+j*squareLength)
        }
    }
}

function drawElement(i, j, x, y){
    var element = pieces.find(p=>p.checkPiece(i,j))
    if(element === undefined)return
    if(element.type === 1 && !element.isKing){
        fill(255,0,0)
        ellipse(x+squareLength/2, y+squareLength/2, squareLength*3/5, squareLength*3/5)
    }
    else if(element.type === 2 && !element.isKing){
        fill(0)
        ellipse(x+squareLength/2, y+squareLength/2, squareLength*3/5, squareLength*3/5)
    }
    else if(element.type === 1 && element.isKing){
        fill(255,0,0)
        stroke(0)
        strokeWeight(3)
        ellipse(x+squareLength/2, y+squareLength/2, squareLength*3/5, squareLength*3/5)
        noStroke()
    }
    else if(element.type === 2&& element.isKing){
        fill(0)
        stroke(255,0,0)
        strokeWeight(3)
        ellipse(x+squareLength/2, y+squareLength/2, squareLength*3/5, squareLength*3/5)
        noStroke()
    }
}