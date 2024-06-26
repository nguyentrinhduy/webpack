import { Buff, BuffType } from '../buff/Buff'
import { NormalLandSprite } from '../constants/ResourcePath'
import { ILand } from './ILand'
import { PropellerBuff } from '../buff/PropellerBuff'
import { JetpackBuff } from '../buff/JetpackBuff'
import { SpringBuff } from '../buff/SpringBuff'
import { Camera } from '../../game-engine/camera/Camera'
import { PLAYER_START_VELOCITY } from '../constants/Player'
import { ImageGameObject } from '../../game-engine/game-objects/ImageGameObject'
import { MathHandler } from '../../game-engine/math/MathHandler'
import { Player } from '../player/Player'
import { PlayerState } from '../player/PlayerState'
import { Position } from '../../game-engine/game-objects/Position'
import { LAND_DEPTH } from '../constants/Depths'

export class NormalLand extends ImageGameObject implements ILand {
    private buff: Buff | null

    constructor() {
        super(NormalLandSprite)
        this.scaleSize(2)
        this.buff = null
        this.depth = LAND_DEPTH
    }

    private setPositionForBuff() {
        let service = MathHandler.getInstance()
        this.buff!.setPosition(new Position(
            this.position.getX() + service.getRandomFloat(0, this.size.getWidth() - this.buff!.getWidth()),
            this.position.getY() - this.buff!.getHeight(),
        ))
    }
    public randomizeBuff(): Buff | null {
        let service = MathHandler.getInstance()
        let randomNum = service.getRandomInt(0, 30)
        switch (randomNum) {
            case BuffType.Propeller: {
                this.buff = new PropellerBuff()
                this.setPositionForBuff()
                break
            }
            case BuffType.Jetpack: {
                this.buff = new JetpackBuff()
                this.setPositionForBuff()
                break
            }
            case BuffType.Spring: {
                this.buff = new SpringBuff()
                this.setPositionForBuff()
                break
            }
            default: {
                break
            }
        }
        return this.buff
    }
    public onJumped(player: Player): void {
        if (this.buff && player.collides(this.buff)) {
            this.buff.onReceived(player)
        } else {
            console.log("jumped")
            player.setVelocity(PLAYER_START_VELOCITY)
            if (player.getState() != PlayerState.ShootUp) {
                player.setState(PlayerState.Jump)
            }
        }
    }
    public move(deltaTime: number): void {}
}
