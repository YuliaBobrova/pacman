import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener
} from "@angular/core";
import { WALLS_1 } from "src/app/shared/consts/level-1-walls";
import { MAP_1 } from "src/app/shared/consts/level-1-map";

@Component({
  selector: "app-game-level",
  templateUrl: "./game-level.component.html",
  styleUrls: ["./game-level.component.scss"]
})
export class GameLevelComponent implements OnInit {
  blockSize = 20;
  WALLS = WALLS_1;
  PILL = 4;
  DOT = 1;
  EMPTY = 2;
  BLOCK = 3;
  PACMAN = 8;
  pillSize = 0;
  MAP = MAP_1;
  boardHeight: number;
  boardWidth: number;
  direction = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: true
  };
  startX = 4 * this.blockSize + this.blockSize / 2;
  startY = 10 * this.blockSize + this.blockSize / 2;
  mapPositionX = 10;
  mapPositionY = 4;
  arrowKey: number;

  @ViewChild("canvas", { static: true }) board: ElementRef;
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.arrowKey = event.keyCode;
  }

  constructor() {}

  private checkWay() {
    console.log(this.arrowKey);
    switch (this.arrowKey) {
      case 40: {
        if (this.MAP[this.mapPositionX + 1][this.mapPositionY] !== 0) {
          this.direction = {
            LEFT: false,
            RIGHT: false,
            UP: false,
            DOWN: true
          };
        } 
        break;
      }
      case 39: {
        if (this.MAP[this.mapPositionX][this.mapPositionY + 1] !== 0) {
          this.direction = {
            LEFT: false,
            RIGHT: true,
            UP: false,
            DOWN: false
          };
        } 
        break;
      }
      case 38: {
        if (this.MAP[this.mapPositionX - 1][this.mapPositionY] !== 0) {
          this.direction = {
            LEFT: false,
            RIGHT: false,
            UP: true,
            DOWN: false
          };
        }
        break;
      }
      case 37: {
        if (this.MAP[this.mapPositionX][this.mapPositionY - 1] !== 0) {
          this.direction = {
            LEFT: true,
            RIGHT: false,
            UP: false,
            DOWN: false
          };
        } 
        break;
      }
      default: {
        break;
      }
    }
    console.log(JSON.stringify(this.direction));
  }

  ngOnInit() {
    this.board.nativeElement.setAttribute("width", this.blockSize * 30 + "px");
    this.board.nativeElement.setAttribute("height", this.blockSize * 30 + "px");
    const ctx = this.board.nativeElement.getContext("2d");
    ctx.fillRect(
      0,
      0,
      this.board.nativeElement.width,
      this.board.nativeElement.height
    );

    this.boardHeight = this.MAP.length;
    this.boardWidth = this.MAP[0].length;
    this.draw(ctx);
    setInterval(() => this.next(ctx), 500);
  }

  next(ctx) {
    this.checkWay();
    if (
      this.MAP[this.mapPositionX + 1][this.mapPositionY] !== 0 &&
      this.direction.DOWN
    ) {
      this.goDown(ctx);
    }
    if (
      this.MAP[this.mapPositionX][this.mapPositionY + 1] !== 0 &&
      this.direction.RIGHT
    ) {
      this.goRight(ctx);
    }
    if (
      this.MAP[this.mapPositionX - 1][this.mapPositionY] !== 0 &&
      this.direction.UP
    ) {
      this.goUp(ctx);
    }
    if (
      this.MAP[this.mapPositionX][this.mapPositionY - 1] !== 0 &&
      this.direction.LEFT
    ) {
      this.goLeft(ctx);
    }
  }

  private goRight(ctx: any) {
    this.MAP[this.mapPositionX][this.mapPositionY + 1] = this.PACMAN;
    this.MAP[this.mapPositionX][this.mapPositionY] = this.EMPTY;
    this.draw(ctx);
    this.mapPositionY++;
    // this.arrowKey = 39;
  }

  private goLeft(ctx: any) {
    this.MAP[this.mapPositionX][this.mapPositionY - 1] = this.PACMAN;
    this.MAP[this.mapPositionX][this.mapPositionY] = this.EMPTY;
    this.draw(ctx);
    this.mapPositionY--;
    // this.arrowKey = 37;
  }

  private goDown(ctx: any) {
    this.MAP[this.mapPositionX + 1][this.mapPositionY] = 8;
    this.MAP[this.mapPositionX][this.mapPositionY] = 2;
    this.draw(ctx);
    this.mapPositionX++;
    // this.arrowKey = 40;
  }

  private goUp(ctx: any) {
    this.MAP[this.mapPositionX - 1][this.mapPositionY] = 8;
    this.MAP[this.mapPositionX][this.mapPositionY] = 2;
    this.draw(ctx);
    this.mapPositionX--;
    // this.arrowKey = 38;
  }

  draw(ctx) {
    ctx.fillStyle = "#000";
    ctx.fillRect(
      0,
      0,
      this.boardWidth * this.blockSize,
      this.boardHeight * this.blockSize
    );

    this.drawWalls(ctx);

    for (let i = 0; i < this.boardHeight; i += 1) {
      for (let j = 0; j < this.boardWidth; j += 1) {
        this.drawBlock(i, j, ctx);
      }
    }

    this.drawPills(ctx);
    this.drawPackman(ctx);
  }

  private drawWalls(ctx: any) {
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    for (let i = 0; i < this.WALLS.length; i++) {
      const line = this.WALLS[i];
      ctx.beginPath();
      for (let j = 0; j < line.length; j++) {
        const p = line[j];
        if (p.move) {
          ctx.moveTo(p.move[0] * this.blockSize, p.move[1] * this.blockSize);
        } else if (p.line) {
          ctx.lineTo(p.line[0] * this.blockSize, p.line[1] * this.blockSize);
        } else if (p.curve) {
          ctx.quadraticCurveTo(
            p.curve[0] * this.blockSize,
            p.curve[1] * this.blockSize,
            p.curve[2] * this.blockSize,
            p.curve[3] * this.blockSize
          );
        }
      }
      ctx.stroke();
    }
  }

  drawPills(ctx) {
    let pillSize = 0;
    if (++pillSize > 30) {
      pillSize = 0;
    }

    for (let i = 0; i < this.boardHeight; i += 1) {
      for (let j = 0; j < this.boardWidth; j += 1) {
        if (this.MAP[i][j] === this.PILL) {
          ctx.beginPath();

          ctx.fillStyle = "#000";
          ctx.fillRect(
            j * this.blockSize,
            i * this.blockSize,
            this.blockSize,
            this.blockSize
          );

          ctx.fillStyle = "#FFF";
          ctx.arc(
            j * this.blockSize + this.blockSize / 2,
            i * this.blockSize + this.blockSize / 2,
            Math.abs(5 - this.pillSize / 3),
            0,
            Math.PI * 2,
            false
          );
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  drawBlock(y, x, ctx) {
    let layout = this.MAP[y][x];

    if (layout === this.PILL) {
      return;
    }

    ctx.beginPath();
    if (layout === this.EMPTY || layout === this.BLOCK || layout === this.DOT) {
      ctx.fillStyle = "#000";
      ctx.fillRect(
        x * this.blockSize,
        y * this.blockSize,
        this.blockSize,
        this.blockSize
      );

      if (layout === this.DOT) {
        ctx.fillStyle = "#FFF";
        ctx.fillRect(
          x * this.blockSize + this.blockSize / 2.5,
          y * this.blockSize + this.blockSize / 2.5,
          this.blockSize / 6,
          this.blockSize / 6
        );
      }
    }
    ctx.closePath();
  }

  drawPackman(ctx) {
    for (let i = 0; i < this.boardHeight; i += 1) {
      for (let j = 0; j < this.boardWidth; j += 1) {
        if (this.MAP[i][j] === this.PACMAN) {
          console.log(
            this.mapPositionX,
            this.mapPositionY,
            this.MAP[this.mapPositionX + 1][this.mapPositionY]
          );
          ctx.beginPath();
          ctx.fillStyle = "#ffff00";
          ctx.arc(
            j * this.blockSize + this.blockSize / 2,
            i * this.blockSize + this.blockSize / 2,
            Math.abs(this.blockSize / 1.7),
            0,
            Math.PI * 2,
            false
          );
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }
}
