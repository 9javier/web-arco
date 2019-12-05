import {
    animation, trigger, animateChild, group,
    transition, animate, style, query
} from '@angular/animations';

export const screenAnimation = animation([
    style({
        marginTop: '{{margin}}',
    })
]) 