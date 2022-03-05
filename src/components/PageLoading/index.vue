<template>
    <div class="loader-wrapper">
        <div class="loader-text">
            <p class="text-bg">{{ loadingText }}</p>
            <p class="text-over">{{ loadingText }}</p>
        </div>
        <div class="loader-container">
            <div class="loader">
                <div class="roller"></div>
                <div class="roller"></div>
            </div>

            <div id="loader2" class="loader">
                <div class="roller"></div>
                <div class="roller"></div>
            </div>

            <div id="loader3" class="loader">
                <div class="roller"></div>
                <div class="roller"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PageLoading',
    props: {
        loadingText: {
            type: String,
            default: '加载中...'
        }
    }
};
</script>

<style scoped lang="scss">
/* ----- Base ----- */

$body-bg: #55c1fa;

/* ----- Loader ----- */

$loader-duration: 1.2s;
$loader-iteration-count: infinite;
$loader-direction: normal;

.loader-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.loader-text {
    position: relative;
    width: 100%;
    height: 52px;
    text-align: center;
    font-size: 20px;
    margin-bottom: 25px;

    p {
        font-family: zcool-kuaile, sans-serif;
        position: absolute;
        font-size: 2em;
        left: 50%;
        transform: translateX(-50%);
    }

    .text-bg {
        -webkit-text-stroke: var(--el-color-primary) 1px;
        color: transparent;
    }

    .text-over {
        color: var(--el-color-primary);
        animation: textMove 3s ease-in-out infinite;
    }
}
.loader-container {
    position: relative;
    width: 148px;
    height: 100px;
}
.loader {
    width: 148px;
    height: 100px;
    top: 0;
    left: 0;
    position: absolute;

    &:after {
        content: '';
        top: auto;
        position: absolute;
        display: block;
        animation: shadow $loader-duration $loader-iteration-count linear;
        -moz-animation: shadow $loader-duration $loader-iteration-count linear;
        bottom: 0;
        left: 0;
        height: 0.25em;
        width: 1em;
        border-radius: 50%;
        background-color: darken($body-bg, 45%);
        opacity: 0.3;
    }
}
.roller,
.roller:last-child {
    width: 70px;
    height: 70px;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-animation: rollerCoaster $loader-duration $loader-iteration-count linear;
    -webkit-transform: rotate(135deg);
    -moz-animation: rollerCoaster $loader-duration $loader-iteration-count linear;
    -moz-transform: rotate(135deg);
    animation: rollerCoaster $loader-duration $loader-iteration-count linear;
    transform: rotate(135deg);
}
.roller:last-child {
    left: auto;
    right: 0;
    -webkit-transform: rotate(-45deg);
    -webkit-animation: rollerCoaster2 $loader-duration $loader-iteration-count linear;
    -moz-transform: rotate(-45deg);
    -moz-animation: rollerCoaster2 $loader-duration $loader-iteration-count linear;
    transform: rotate(-45deg);
    animation: rollerCoaster2 $loader-duration $loader-iteration-count linear;
}
.roller:before,
.roller:last-child:before {
    content: '';
    display: block;
    width: 15px;
    height: 15px;
    background: var(--el-color-primary);
    border-radius: 50%;
}

@-webkit-keyframes rollerCoaster {
    0% {
        -webkit-transform: rotate(135deg);
    }
    8% {
        -webkit-transform: rotate(240deg);
    }

    20% {
        -webkit-transform: rotate(300deg);
    }

    40% {
        -webkit-transform: rotate(380deg);
    }
    45% {
        -webkit-transform: rotate(440deg);
    }
    50% {
        -webkit-transform: rotate(495deg);
        opacity: 1;
    }
    50.1% {
        -webkit-transform: rotate(495deg);
        opacity: 0;
    }
    100% {
        -webkit-transform: rotate(495deg);
        opacity: 0;
    }
}

@-webkit-keyframes rollerCoaster2 {
    0% {
        opacity: 0;
    }
    49.9% {
        opacity: 0;
    }
    50% {
        opacity: 1;
        -webkit-transform: rotate(-45deg);
    }
    58% {
        -webkit-transform: rotate(-160deg);
    }

    70% {
        -webkit-transform: rotate(-240deg);
    }

    80% {
        -webkit-transform: rotate(-300deg);
    }

    90% {
        -webkit-transform: rotate(-340deg);
    }

    100% {
        -webkit-transform: rotate(-405deg);
    }
}

@-webkit-keyframes shadow {
    0% {
        opacity: 0.3;
        -webkit-transform: translateX(65px) scale(0.5, 0.5);
    }
    8% {
        -webkit-transform: translateX(30px) scale(2, 2);
    }

    13% {
        -webkit-transform: translateX(0px) scale(1.3, 1.3);
    }

    30% {
        -webkit-transform: translateX(-15px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    50% {
        -webkit-transform: translateX(60px) scale(1.2, 1.2);
        opacity: 0.3;
    }

    60% {
        -webkit-transform: translateX(130px) scale(2, 2);
        opacity: 0.05;
    }
    65% {
        -webkit-transform: translateX(145px) scale(1.2, 1.2);
    }
    80% {
        -webkit-transform: translateX(120px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    90% {
        -webkit-transform: translateX(80px) scale(0.8, 0.8);
    }
    100% {
        -webkit-transform: translateX(60px);
        opacity: 0.3;
    }
}

/* Moz */

@-moz-keyframes rollerCoaster {
    0% {
        -moz-transform: rotate(135deg);
    }
    8% {
        -moz-transform: rotate(240deg);
    }
    20% {
        -moz-transform: rotate(300deg);
    }
    40% {
        -moz-transform: rotate(380deg);
    }
    45% {
        -moz-transform: rotate(440deg);
    }
    50% {
        -moz-transform: rotate(495deg);
        opacity: 1;
    }
    50.1% {
        -moz-transform: rotate(495deg);
        opacity: 0;
    }
    100% {
        -moz-transform: rotate(495deg);
        opacity: 0;
    }
}

@-moz-keyframes rollerCoaster2 {
    0% {
        opacity: 0;
    }
    49.9% {
        opacity: 0;
    }
    50% {
        opacity: 1;
        -moz-transform: rotate(-45deg);
    }
    58% {
        -moz-transform: rotate(-160deg);
    }
    70% {
        -moz-transform: rotate(-240deg);
    }
    80% {
        -moz-transform: rotate(-300deg);
    }
    90% {
        -moz-transform: rotate(-340deg);
    }
    100% {
        -moz-transform: rotate(-405deg);
    }
}

@-moz-keyframes shadow {
    0% {
        opacity: 0.3;
        -moz-transform: translateX(65px) scale(0.5, 0.5);
    }
    8% {
        -moz-transform: translateX(30px) scale(2, 2);
    }
    13% {
        -moz-transform: translateX(0px) scale(1.3, 1.3);
    }
    30% {
        -moz-transform: translateX(-15px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    50% {
        -moz-transform: translateX(60px) scale(1.2, 1.2);
        opacity: 0.3;
    }
    60% {
        -moz-transform: translateX(130px) scale(2, 2);
        opacity: 0.05;
    }
    65% {
        -moz-transform: translateX(145px) scale(1.2, 1.2);
    }
    80% {
        -moz-transform: translateX(120px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    90% {
        -moz-transform: translateX(80px) scale(0.8, 0.8);
    }
    100% {
        -moz-transform: translateX(60px);
        opacity: 0.3;
    }
}

/* No-prefix */
@keyframes rollerCoaster {
    0% {
        transform: rotate(135deg);
    }
    8% {
        transform: rotate(240deg);
    }
    20% {
        transform: rotate(300deg);
    }
    40% {
        transform: rotate(380deg);
    }
    45% {
        transform: rotate(440deg);
    }
    50% {
        transform: rotate(495deg);
        opacity: 1;
    }
    50.1% {
        transform: rotate(495deg);
        opacity: 0;
    }
    100% {
        transform: rotate(495deg);
        opacity: 0;
    }
}

@keyframes rollerCoaster2 {
    0% {
        opacity: 0;
    }
    49.9% {
        opacity: 0;
    }
    50% {
        opacity: 1;
        transform: rotate(-45deg);
    }
    58% {
        transform: rotate(-160deg);
    }
    70% {
        transform: rotate(-240deg);
    }
    80% {
        transform: rotate(-300deg);
    }
    90% {
        transform: rotate(-340deg);
    }
    100% {
        transform: rotate(-405deg);
    }
}

@keyframes shadow {
    0% {
        opacity: 0.3;
        transform: translateX(65px) scale(0.5, 0.5);
    }
    8% {
        transform: translateX(30px) scale(2, 2);
    }
    13% {
        transform: translateX(0px) scale(1.3, 1.3);
    }
    30% {
        transform: translateX(-15px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    50% {
        transform: translateX(60px) scale(1.2, 1.2);
        opacity: 0.3;
    }
    60% {
        transform: translateX(130px) scale(2, 2);
        opacity: 0.05;
    }
    65% {
        transform: translateX(145px) scale(1.2, 1.2);
    }
    80% {
        transform: translateX(120px) scale(0.5, 0.5);
        opacity: 0.1;
    }
    90% {
        transform: translateX(80px) scale(0.8, 0.8);
    }
    100% {
        transform: translateX(60px);
        opacity: 0.3;
    }
}

@keyframes textMove {
    0% {
        clip-path: polygon(
            0% 62%,
            14% 55%,
            24% 51%,
            32% 51%,
            41% 56%,
            50% 59%,
            60% 59%,
            69% 55%,
            76% 49%,
            84% 48%,
            93% 50%,
            100% 54%,
            100% 100%,
            0 100%
        );
    }
    50% {
        clip-path: polygon(
            0% 62%,
            10% 62%,
            23% 68%,
            36% 68%,
            44% 64%,
            50% 59%,
            59% 54%,
            67% 55%,
            74% 59%,
            86% 62%,
            94% 61%,
            100% 54%,
            100% 100%,
            0 100%
        );
    }
    100% {
        clip-path: polygon(
            0% 62%,
            14% 55%,
            24% 51%,
            32% 51%,
            41% 56%,
            50% 59%,
            60% 59%,
            69% 55%,
            76% 49%,
            84% 48%,
            93% 50%,
            100% 54%,
            100% 100%,
            0 100%
        );
    }
}

#loader2 {
    &:after {
        -webkit-animation-delay: 0.15s;
        animation-delay: 0.15s;
    }

    .roller {
        -webkit-animation-delay: 0.15s;
        animation-delay: 0.15s;
    }
}

#loader3 {
    &:after {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
    }

    .roller {
        -webkit-animation-delay: 0.3s;
        animation-delay: 0.3s;
    }
}
</style>
