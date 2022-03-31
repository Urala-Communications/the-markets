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
            i: this.selected,
            text: this.timeframes[this.selected].text,
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
                text: this.timeframes[this.selected].text,
                i: this.selected
            })
        }
    },
    data() {
        return {
            selected: this.$props.charts.length > 4 ? 4 : 0
        }
    }
}
</script>

<style lang="scss">
.tf-selector {
    position: absolute;
    top: 0;
    left: 16px;
    font-size: 16px;
    color: #ccc;
    padding: 5px;
    border-radius: 3px;
    @media (max-width: 768px) {
        left: 10px;
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
    color: rgb(68, 199, 103);
}
</style>