<template>
  <div class="container content buffer pb-5">
    <div class="row d-flex justify-content-center">
      <div class="col-11 white-well pb-3">
        <h2 class="mb-4 pt-3">Trading 101</h2>
        <ul>
          <li>
            <NuxtLink to="/trading-101/trading-apps-for-beginners">The best trading apps for beginners</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/trading-101/trading-terminology">Trading terminology</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/trading-101/investment-methodology">Investment methodology</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default { }

</script>

<style lang="scss" scoped>
    p {
        font-size: 14px;
        margin-bottom: 0.3rem;
    }
    hr {
        border-top: 1px solid rgb(198 198 198 / 41%);
        display: block;
        width: 100%;
    }
</style>
