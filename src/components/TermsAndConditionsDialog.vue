<template>
    <div class="terms-dialog-wrapper">
        <el-dialog
                :visible.sync="termsVisible"
                width="40%"
                :before-close="cancelLogin"
                v-on:close="cancelLogin">
            <div class="text-left">
                <h3 class="terms-headline">Terms and Conditions</h3>
                <p>In order to proceed to the Data Marketplace, you must first accept the Terms and Conditions. We
                    advise
                    you to read them carefully and understand that you shall solely be liable for the appropriateness,
                    lawfulness, and accurateness of the data in any way processed by you using the Data Marketplace.</p>
            </div>
            <a href="!#" target="_blank" class="cancel-terms-btn terms-link">
                <el-button class="cancel-btn cancel-terms-btn" @click="goToTermsAndConditions">READ TERMS AND CONDITIONS</el-button>
            </a>
            <el-row>
                <el-col :span="24" class="text-left">
                    <template>
                        <el-checkbox class="checkbox" v-model="checkedTerms">I accept terms and conditions.
                        </el-checkbox>
                    </template>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <el-button class="cancel-btn cancel-terms-btn" @click="cancelLogin">GO BACK</el-button>
                    </el-col>
                    <el-col :span="18">
                        <el-button :disabled='isDisabled' class="proceed-btn  no-margin" type="primary"
                                   @click="proceedToMarketPlace">PROCEED TO MARKETPLACE</el-button>
                    </el-col>
                </el-row>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "TermsAndConditionsDialog",

        data() {
            return {
                termsVisible: true,
                checkedTerms: false
            }
        },
        methods: {
            cancelLogin() {
                EventBus.$emit('close-terms');
            },
            proceedToMarketPlace() {
                EventBus.$emit('terms-checked');
            },
            goToTermsAndConditions() {
                window.open(`https://origintrail.io/terms-and-conditions-mainnet`, '_blank');
            }
        },
        computed: {
            isDisabled: function () {
                return !this.checkedTerms;
            }
        }
    }
</script>

<style scoped>

</style>
