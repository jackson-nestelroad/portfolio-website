// Type declarations for particle settings

import Color, { ColorObject } from './Color'
import Stroke, { StrokeObject } from './Stroke'

// Various types of settings allowed
export type ColorSetting = string | Color | ColorObject | Array<string | Color | ColorObject>;
export type OpacitySetting = 'random' | number | Array<number>;
export type RadiusSetting = 'random' | number | Array<number>;
export type ShapeSetting = string | number | Array<number | string>;
export type StrokeSetting = Stroke | StrokeObject;
export type SpeedSetting = number;
export type MoveSetting = {
    speed: SpeedSetting,
    direction: string,
    straight: boolean,
    random: boolean,
    edgeBounce: boolean,
    attract: boolean
} | false;
export interface IBubbleSetting { 
    distance: number,
    radius: number,
    opacity: number
}

// Animation setting
export interface IParticleAnimation {
    speed: SpeedSetting,
    min: 'random' | number | Array<number>,
    sync: boolean
}

// Particle settings object
export interface IParticleSettings {
    number: number,
    density: number,
    color: ColorSetting,
    opacity: OpacitySetting,
    radius: RadiusSetting,
    shape: ShapeSetting,
    stroke: StrokeSetting,
    move: MoveSetting,
    events?: {
        resize: boolean,
        hover: 'bubble' | false,
        click: false
    },
    animate?: {
        opacity: IParticleAnimation | false,
        radius: IParticleAnimation | false
    } | false
}

// Interactive settings object
export interface IInteractiveSettings {
    hover?: {
        bubble?: IBubbleSetting | false,
        repulse?: {
            distance: number
        } | false
    } | false,
    click?: {
        add?: {
            number: number
        } | false,
        remove?: {
            number: number
        } | false
    } | false
}

// Configuration object
export interface IParticlesConfig {
    Particles: IParticleSettings,
    Interactive: IInteractiveSettings
}