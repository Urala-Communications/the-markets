<template>
<!-- Timeframe Selector -->
<div class="tf-selector">
    <span class="timeframe" v-for="(tf, i) in this.timeframes"
        :key="tf.value"
        :tf="tf"
        v-on:click="on_click(tf, i)"
        v-bind:style= "selected === i ? {color: '#44c767'} : {}">
        {{tf.label}}
    </span>
</div>
</template>

<script>
export default {
    name: 'TFSelector',
    props: ['charts'],
    mounted() {
        this.$emit('selected', {
            name: this.timeframes[this.selected].value,
            i: this.selected
        })
    },
    computed: {
        timeframes() {
            return this.$props.charts
        }
    },
    methods: {
        on_click(tf, i) {
            
            this.selected = i
            this.$emit('selected', {
                name: this.timeframes[this.selected].value,
                i: this.selected
            })
        }
    },
    data() {
        return {
            selected: 4
        }
    }
}
</script>

<style lang="scss">
.tf-selector {
    position: absolute;
    top: 0;
    left: 55px;
    font-size: 16px;
    background: #34363b;
    color: #ccc;
    padding: 5px;
    border-radius: 3px;
    @media (max-width: 768px) {
        left: 0px;
    }
}
.timeframe {
    margin-right: 5px;
    user-select: none;
    cursor: pointer;
    font-weight: 200;
    max-width: 10px;
}
.timeframe:hover {
    color: #fff;
}
</style>