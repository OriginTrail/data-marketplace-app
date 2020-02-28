<template>
    <div class="container footerComponent">
        <el-row>
            <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                <img src="../assets/eu-flag.svg"/>
            </el-col>
            <el-col class='onlyOnSmall' :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                <img src="../assets/logo-ngi.svg"/>
            </el-col>
            <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
                <p>This project has received funding from the European Union’s Horizon 2020 research and innovation
                    programme within the framework of the LEDGER Project funded under grant agreement No. 825268.
                </p>
            </el-col>
            <el-col class="onlyOnBig" :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                <img src="../assets/logo-ngi.svg"/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style lang="scss">

    @import "../scss/footer";

</style>
