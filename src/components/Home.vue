<template>
    <div class="container homeComponent">
<!--        <div class="flexer">-->
<!--            <div class="glue">-->
<!--                <div class="textHead">First time here?</div>-->
<!--                <div class="underHead">See how FDM works</div>-->
<!--            </div>-->
<!--            <el-button class='button1' @click="$emit('navigation',11)" type="primary">START HERE</el-button>-->
<!--        </div>-->

        <div class="foodMain">
            <div class="vertical-center">
                <div class="textMain text-center" >Food Data Marketplace</div>
                <el-button class='button2' @click="$emit('navigation',6)" type="danger">EXPLORE</el-button>
            </div>
        </div>
        <el-row :gutter="20" class="footerTres">
            <el-col :xs="24" :sm="24" :md="24" :lg="8"><img class='tresImages' src="../assets/sateliteDM.jpg"/></el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8"><img class='tresImages' src="../assets/sensorDM.jpg"/></el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="8"><img class='tresImages' src="../assets/laboratoryDM.jpg"/>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Home",
        props:['submited'],
        watch:{

            submited:{
                immediate:true,

                handler() {
                    if(this.submited==false){
                        this.notifier()
                        this.$emit('once')
                    }
                }
            }
        },
        methods:{
            notifier(){

                this.$notify({
                    dangerouslyUseHTMLString: true,
                    message:
                        '<div class="flexer" style=" display: flex; justify-content: flex-end; align-items: center;">'+
                        '<div class="glue" style="margin-right: 32px;">'+
                        '                <div class="textHead" style="font-family:Roboto; color: #131415; text-align: center;letter-spacing: normal;font-size: 24px;font-weight: bold;font-stretch: normal;font-style: normal;line-height: 2.25;">First time here?</div>\n' +
                        '                <div class="underHead" style=" margin-top: -5px;margin-bottom:23px;font-weight: normal; line-height: 1;letter-spacing: normal;text-align: left; color: #131415;opacity: 0.5;font-style: normal;font-size: 16px;font-stretch: normal;">See how FDM works</div>\n' +
                        '            </div>\n' +
                        '            <el-button id="dugme" @click="notifier" style="cursor: pointer;color: #fff;; background: #fff;border: 1px solid #dcdfe6;text-align: center;box-sizing: border-box;outline: 0;  margin: 0;transition: .1s;padding: 0px 15px;border-radius: 4px; white-space: nowrap; display: inline-block; border-color: #136bc8;background-color: #136bc8;font-size: 14px;font-weight: 500;"  type="primary">START HERE</el-button>\n' +
                        '        </div>',
                    offset: 60,
                    duration:0
                });

                document.getElementById("dugme").addEventListener("click",()=> this.emmitFunction(11));
            },
            emmitFunction(value){

                this.$notify.closeAll();
                // this.$emit('navigation',value);

                window.open(`https://tracelabs.io/fdm/getting-started`, '_blank');
            }
        },
        beforeDestroy() {
            this.$notify.closeAll();
        }
    }
</script>

<style lang="scss">
    @import "../scss/home";
    .el-notification{
        border-left: 5px solid #136bc8;
        border-radius: 4px 0px 0px 4px;
    }

</style>
