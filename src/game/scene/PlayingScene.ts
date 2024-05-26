import { DataManager } from '../DataManager'
import { Button } from '../../game-engine/game-objects/Button'
import { GameObject } from '../../game-engine/game-objects/GameObject'
import { Player } from '../player/Player'
import { BackgroundSprite, PauseButtonSprite, TopBackgroundSprite } from '../constants/ResourcePath'
import { PauseScene } from './PauseScene'
import { Scene } from '../../game-engine/scene-handler/Scene'
import {
    BACKGROUND_POSITION,
    PAUSE_BUTTON_POSITION,
    TOP_BACKGROUND_POSITION,
} from '../constants/FixedPosition'
import { Direction, PlayerState } from '../player/PlayerState'
import { EndScene } from './EndScene'
import { ILand, Land, LandType } from '../land/ILand'
import { Monster } from '../monster/Monster'
import { PLAYER_START_POSITION } from '../constants/Player'
import { ImageGameObject } from '../../game-engine/game-objects/ImageGameObject'
import { Bullet } from '../player/Bullet'
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../constants/WindowBounds'
import { NormalLand } from '../land/NormalLand'
import { LAND_HEIGHT, LAND_WIDTH } from '../constants/Land'
import { MovingLand } from '../land/MovingLand'
import { Camera } from '../../game-engine/camera/Camera'
import { MathHandler } from '../../game-engine/math/MathHandler'
import { DustLand } from '../land/DustLand'
import { TextGameObject } from '../../game-engine/game-objects/TextGameObject'

export class PlayingScene extends Scene {
    private dataManager: DataManager
    private background: ImageGameObject
    private topBackground: ImageGameObject
    private pauseButton: Button
    private scoreObject: TextGameObject
    private score: number
    private player: Player
    private lands: Land[]
    private monsters: Monster[]
    private bullets: Bullet[]
    private camera: Camera
    constructor() {
        super()
        this.dataManager = DataManager.getInstance()
        this.loadResources()
    }
    private loadResources() {
        // load player
        this.player = this.dataManager.getPlayer()

        // load lands
        this.lands = this.dataManager.getLands()

        // load monsters
        this.monsters = this.dataManager.getMonsters()

        // load bullets
        this.bullets = this.dataManager.getBullets()
        // load background
        this.background = new ImageGameObject(BackgroundSprite)
        this.background.setPosition([...BACKGROUND_POSITION])

        // load top background
        this.topBackground = new ImageGameObject(TopBackgroundSprite)
        this.topBackground.setPosition([...TOP_BACKGROUND_POSITION])

        // load pause button
        this.pauseButton = new Button(PauseButtonSprite)
        this.pauseButton.scaleSize(1.5)
        this.pauseButton.setPosition([...PAUSE_BUTTON_POSITION])

        // load camera
        this.camera = this.dataManager.getCamera()

        // load score
        this.score = this.dataManager.getScore()
        this.scoreObject = new TextGameObject(this.score.toString())
    }
    // private handleMouseClick = (event: MouseEvent) => {
    //     const rect = canvas.getBoundingClientRect()
    //     const mouseX = event.clientX - rect.left
    //     const mouseY = event.clientY - rect.top

    //     if (this.pauseButton.isClicked(mouseX, mouseY)) {
    //         this.context.transitionTo(new PauseScene())
    //         canvas.removeEventListener('click', this.handleMouseClick)
    //     }
    // }
    // private handleArrowKeysReleased = (event: KeyboardEvent) => {
    //     switch (event.key) {
    //         case 'w':
    //         case 'ArrowUp':
    //             break
    //         case 's':
    //         case 'ArrowDown':
    //             break
    //         case 'a':
    //         case 'ArrowLeft':
    //             break
    //         case 'd':
    //         case 'ArrowRight':
    //             // Stop moving when arrow keys are released
    //             this.player.setVelocity([0, this.player.getVelocity()[1]])
    //             break
    //         default:
    //             // Handle other keys if necessary
    //             break
    //     }
    // }
    // private handleArrowKeysPressed = (event: KeyboardEvent) => {
    //     switch (event.key) {
    //         case 'w':
    //         case 'ArrowUp':
    //             // Handle up arrow key

    //             break
    //         case 's':
    //         case 'ArrowDown':
    //             // Handle down arrow key

    //             break
    //         case 'a':
    //         case 'ArrowLeft':
    //             // Handle left arrow key
    //             this.player.setVelocityDirection(Direction.Left)
    //             break
    //         case 'd':
    //         case 'ArrowRight':
    //             // Handle right arrow key
    //             this.player.setVelocityDirection(Direction.Right)
    //             break
    //         default:
    //             // Handle other keys
    //             break
    //     }
    // }

    render() {
        const canvas = document.getElementById("game") as HTMLCanvasElement
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let cameraOffset = this.camera.getOffset()
        this.background.display()
        this.lands.forEach((element) => {
            element.display(cameraOffset)
        })
        this.topBackground.display()
        this.pauseButton.display()
        this.player.display(cameraOffset)
    }
    update(deltaTime: number): void {
        if (this.camera.isOutOfBottomRange(this.player) && 
            this.player.getState() == PlayerState.Fall) {
            this.context.transitionTo(new EndScene())
            return
        }
        // console.log(this.player.velocity[1]);
        this.lands.forEach((element) => {
            if (this.player.standOn(element)) {
                element.onJumped(this.player)
            }
        })
        this.updateMap(deltaTime)
        this.player.autoFall(deltaTime)
        this.camera.update()
    }
    private updateMap(deltaTime: number) {
        // move
        this.lands.forEach((element) => {
            element.move(deltaTime)
        })
        // remove stuffs below the camera
        while (this.lands.length > 0 && this.camera.isOutOfBottomRange(this.lands[0])) {
            this.lands.shift()
        }
        while (this.monsters.length > 0 && this.camera.isOutOfBottomRange(this.monsters[0])) {
            this.monsters.shift()
        }

        // add stuffs above the camera
        let mathHandler = MathHandler.getInstance()
        while (this.lands.length == 0 || 
                this.lands[this.lands.length - 1].getPositionY() - this.camera.getOffsetY() >= 50) {
            let previousHeight = WINDOW_HEIGHT
            if (this.lands.length > 0) {
                previousHeight = this.lands[this.lands.length - 1].getPositionY()
            }
            let randomNum = mathHandler.getRandomInt(0, 2)
            switch (randomNum) {
                case LandType.NormalLand: {
                    let newLand = new NormalLand()
                    newLand.setPosition([
                        mathHandler.getRandomFloat(0, WINDOW_WIDTH - newLand.getWidth()),
                        mathHandler.getRandomFloat(
                            previousHeight - LAND_HEIGHT - 200,
                            previousHeight - LAND_HEIGHT
                        ),
                    ])
                    this.lands.push(newLand)
                    break
                }
                case LandType.MovingLand: {
                    let newLand = new MovingLand()
                    newLand.setPosition([
                        mathHandler.getRandomFloat(0, WINDOW_WIDTH - newLand.getWidth()),
                        mathHandler.getRandomFloat(
                            previousHeight - LAND_HEIGHT - 200,
                            previousHeight - LAND_HEIGHT
                        ),
                    ])
                    this.lands.push(newLand)
                    break
                }
                case LandType.DustLand: {
                    let newLand = new DustLand()
                    newLand.setPosition([
                        mathHandler.getRandomFloat(0, WINDOW_WIDTH - newLand.getWidth()),
                        mathHandler.getRandomFloat(
                            previousHeight - LAND_HEIGHT - 200,
                            previousHeight - LAND_HEIGHT
                        ),
                    ])
                    this.lands.push(newLand)
                    break
                }
            }
        }
    }

    processInput(): void {}
}