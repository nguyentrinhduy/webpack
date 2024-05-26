import { AnimationGameObject } from '../../game-engine/game-objects/AnimationGameObject'
import { ImageGameObject } from '../../game-engine/game-objects/ImageGameObject'
import { GameObject } from '../../game-engine/game-objects/GameObject'
import { Player } from '../player/Player'
import { Sprite } from '../../game-engine/resource-factory/Sprite'
export enum LandType {
    NormalLand = 0,
    MovingLand = 1,
    DustLand = 2,
}
export type Land = ILand & GameObject
export interface ILand {
    randomizeBuff(): void
    move(deltaTime: number): void
    onJumped(player: Player): void
}
