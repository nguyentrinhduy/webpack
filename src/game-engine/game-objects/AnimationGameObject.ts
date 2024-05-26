import { Animator } from './Animator'
import { Camera } from '../camera/Camera'
import { GameObject } from './GameObject'
import { TIME_DIFFERENCE_ANIMATION } from '../constant'
import { SpriteFactory } from '../resource-factory/SpriteFactory'

export class AnimationGameObject extends GameObject {
    
    private animator: Animator

    constructor(spritesName: string[]) {
        super()
        this.animator = new Animator(
            SpriteFactory
            .getInstance()
            .getAnimationSprite(spritesName)
        )
    }
    requestLoopAnimation() {
        this.animator.setRangeAnimation(null)
        this.animator.setCurrenAnimation(0)
        this.animator.setTimeDifference(TIME_DIFFERENCE_ANIMATION)
    }
    requestSingleAnimation(target: number) {
        this.animator.setTimeDifference(0)
        this.animator.setCurrenAnimation(target)
        this.animator.setRangeAnimation(null)
    }
    requestMultipleAnimation(from: number, to: number) {
        this.animator.setCurrenAnimation(from)
        this.animator.setRangeAnimation([from, to])
        this.animator.setTimeDifference(TIME_DIFFERENCE_ANIMATION)
    }
    timePassed(deltaTime: number) {
        this.animator.timePassed(deltaTime)
    }
    display(cameraOffset: [number, number] = [0, 0]): void {
        this.animator.display([this.position[0] - cameraOffset[0], this.position[1] - cameraOffset[1]], this.size);
    }
}