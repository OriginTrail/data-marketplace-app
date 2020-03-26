<template>
    <div class="dialogs-wrapper">
        <el-dialog :visible.sync="outerVisible"
                   :before-close="handleClose"
                   v-if="datasetData.dataset"
                   width="65%">

            <!-- DATASET INFO -->
            <el-row>
                <el-col :span="10" class="dataset-img-col">
                    <img class="dataset-img" :src="generateImage()" alt="">
                </el-col>
                <el-col :span="14" class="dataset-info text-left">
                    <div class="top-info-wrapp">
                        <h3>{{ (datasetData.dataset.name === '') ? 'Name not provided' : datasetData.dataset.name }}</h3>
                        <span class="gray">Issuer:</span>
                        <div class="gray-wrapper">
                             <span class="identity"> {{ (datasetData.seller_erc_id) ? 'did:ethr:' + datasetData.seller_erc_id : 'Seller identity not provided' }}
                        <a target="_blank" class="view-identity" :href="'https://rinkeby.etherscan.io/address/' + datasetData.seller_erc_id" v-if="datasetData.seller_erc_id">VIEW</a></span>
                        </div>

                     <span class="gray"> <p class="space"></p>On sale since: <span
                            class="days-ago">{{ datasetData.timestamp | fromTimestampToHumanReadable}}</span></span>
                    </div>
                    <div class="description-wrapper truncate">
                        <p class="description">{{ (datasetData.dataset.description) ? datasetData.dataset.description : ' Description not provided' }}</p>
                    </div>

                    <el-tag type="info" v-for="(tag, index) in datasetData.dataset.tags" :key="index">{{ (tag) ? tag : 'Tag not provided' }}</el-tag>

                    <el-row class="verify-wrapper">
                        <el-col :span="24">
                            <a class="text-center check-btn">
                                <div class="check-wrapper" @click="verifyIntegrity">
                                    <img class="trac-img" src="images/id-ic-brand-fill-origintrail.png" alt="">VERIFY ON
                                    THE ODN
                                </div>
                            </a>
                        </el-col>

                        <el-col class="trac-amount-col">

                            <span class="trac-amount" v-if="datasetPrice === ''">
                                <i class="el-icon-loading"></i>
                            </span>

                            <span class="trac-amount" v-else>{{ datasetPrice + ' ' }}</span>
                            <span class="trac">TRAC</span>
                            <p class="trac-in-usd" v-if="tracPriceInUsdConverted !== ''"><span>~ </span>{{ tracPriceInUsdConverted.toFixed(3) }} <span class="usd">USD</span></p>
                        </el-col>
                    </el-row>
                    <el-button class="market-card-btn-absolute" type="primary" @click="innerVisible= true" :disabled="datasetPrice === ''">INITIATE
                        PURCHASE
                    </el-button>
                </el-col>
            </el-row>

            <!-- DATASET PURCHASE CONFIRMATION-->
            <el-dialog
                    v-on:close="handleClose"
                    :before-close="handleClose"
                    width="30%"
                    class="confirm-dialog"
                    :visible.sync="innerVisible"
                    :close-on-click-modal="closeOnClick"
                    append-to-body>
                <h3 class="dialog-h3">Are you sure?</h3>
                <p class="purchase-msg">You are about to purchase dataset "<span>{{ (datasetData.dataset.name === '') ? 'Name not provided' : datasetData.dataset.name }}</span>" for {{datasetPrice}} TRAC</p>
                <elrow>
                    <el-col :span="10">
                        <el-button @click="closePreview" class="cancel-btn">CANCEL</el-button>
                    </el-col>
                    <el-col :span="14">
                        <el-button class="market-card-btn blue-button no-margin" type="primary" @click="confirmPurchase(datasetData)">CONFIRM PURCHASE</el-button>
                    </el-col>
                </elrow>
            </el-dialog>

            <el-dialog
                    v-on:close="handleClose"
                    :before-close="handleClose"
                    width="33%"
                    :visible.sync="purchaseInitiated"
                    :close-on-click-modal="closeOnClick"
                    append-to-body
                    class="go-to-purchases-dialog">
                <h3 class="dialog-h3">Purchase Initiated.</h3>
                <p>Please be patient, the purchase process can last several minutes depending on the status of the networks.</p>
                <el-button class="market-card-btn blue-button" type="primary" @click="loadMyPurchases()">GO TO MY PURCHASES</el-button>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "PreviewDatasetComponent",
        props: ['dataset', 'index'],
        data() {
            return {
                outerVisible: true,
                innerVisible: false,
                confirmationVisible: false,
                datasetData: {},
                datasetPrice: '',
                purchaseInitiated: false,
                closeOnClick: false,
                tagsImages: {},
                tracPriceInUsd:'',
                tracPriceInUsdConverted:'',
                purchaseStatus: {}
            };
        },
        created() {
            this.tagsImages = window.tagsImages;
        },
        methods: {
            verifyIntegrity(dataset) {
                window.open(`https://explorer.origintrail.io/data-sets/?query=${this.datasetData.ot_objects[0]}&type=id&externalRequest=true&network=marketplacetestnet`, '_blank');
            },
            getPriceForTracInUsd(){
                axios({
                    method: 'get',
                    url: `https://api.coingecko.com/api/v3/simple/price?ids=origintrail&vs_currencies=usd`,
                }).then(response => {
                    this.tracPriceInUsd = response.data.origintrail.usd;
                }).catch((error)=>{

                })
            },
            getPriceForTracInUsd2(datasetPrice) {
                axios({
                    method: 'get',
                    url: `https://api.coingecko.com/api/v3/simple/price?ids=origintrail&vs_currencies=usd`,
                }).then(response => {
                    this.tracPriceInUsd = response.data.origintrail.usd;

                    this.tracPriceInUsdConverted = parseFloat(datasetPrice) * this.tracPriceInUsd;
                }).catch((error)=>{

                })
            },
            generateImage() {
                if(this.datasetData.dataset.tags.length !== 0) {
                    return 'images/' + this.tagsImages[this.datasetData.dataset.tags[0]];
                } else {
                    return 'images/' + this.tagsImages['Other'];
                }
            },
            confirmPurchase(datasetData) {
                this.purchaseInitiated = true;
                this.initiatePurchase(datasetData);
            },
            initiatePurchase(dataset) {

                let requestBody = {};
                requestBody.ot_object_id = dataset.ot_objects[0];
                requestBody.seller_node_id = dataset.seller_node_id;
                requestBody.data_set_id = dataset.dataset.id;

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/purchase`,
                    data: requestBody,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response => {

                    if (response.data) {

                        dataset.handler_id = response.data.handler_id;

                        this.purchaseStatus = this.$notify.info({
                            title: 'Status',
                            message: 'Purchase in progress...',
                            duration: 0
                        });


                        this.checkPurchaseHandler(dataset);

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            },
            checkPurchaseHandler(dataset) {

                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/purchase/result/${dataset.handler_id}`,
                }).then(response => {

                    if (response.data && response.data.status === 'REQUESTED') {

                        setTimeout(() => {
                            this.checkPurchaseHandler(dataset);
                        }, 30000);


                    } else if (response.data.status === 'COMPLETED') {

                        this.purchaseStatus.close();

                        this.$notify({
                            title: 'Purchase status',
                            message: 'Purchase completed!',
                            type: 'success'
                        });

                        // this.readDataset(dataset);

                    } else if (response.data.status === 'INITIATED') {

                        setTimeout(() => {
                            this.checkPurchaseHandler(dataset);
                        }, 30000);

                    } else {

                        this.purchaseStatus.close();

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with purchase!',
                            type: 'warning'
                        });
                    }

                });
            },
            readDataset(dataset) {

                this.$notify.info({
                    title: 'Status',
                    message: 'Read initiated..',
                });

                let requestBody = {};
                requestBody.ot_object_id = dataset.ot_objects[0];
                requestBody.seller_node_id = dataset.seller_node_id;
                requestBody.data_set_id = dataset.dataset.id;

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/read`,
                    data: requestBody,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response => {

                    if (response.data) {

                        dataset.handler_id = response.data.handler_id;
                        this.checkReadHandler(dataset);

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with data read!',
                            type: 'warning'
                        });
                    }

                });
            },
            checkReadHandler(dataset) {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/read/result/${dataset.handler_id}`,
                }).then(response => {

                    if (response.data && response.data.status === 'PENDING') {

                        setTimeout(() => {
                            this.checkReadHandler(dataset);
                        }, 2000);


                    } else if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            title: 'Purchase status',
                            message: 'Purchase and Read completed!',
                            type: 'success'
                        });


                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with purchase!',
                            type: 'warning'
                        });
                    }

                });
            },
            loadMyPurchases() {
                EventBus.$emit('load-my-purchases')
            },
            closePreview() {
                EventBus.$emit('close-preview-dataset');
            },
            handleClose() {
                EventBus.$emit('close-preview-dataset');
                this.tracPriceInUsd = '';
            },
            getPriceForDataset(dataset) {
                let requestBody = {};
                requestBody.ot_object_id = dataset.ot_objects[0];
                requestBody.seller_node_id = dataset.seller_node_id;
                requestBody.data_set_id = dataset.dataset.id;
                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/get_price`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {

                    if (response.data) {

                        dataset.handler_id = response.data.handler_id;
                        this.checkPriceHandler(dataset);

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            },
            checkPriceHandler(dataset) {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/network/private_data/get_price/result/${dataset.handler_id}`,
                }).then(response => {

                    if (response.data && response.data.status === 'PENDING') {

                        setTimeout(() => {
                            this.checkPriceHandler(dataset);
                        }, 2000);


                    } else if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            title: 'Loading price status',
                            message: 'Price successfully loaded!',
                            type: 'success'
                        });

                        this.datasetPrice = response.data.data.message.price_in_trac / 1000000000000000000;

                        this.updatePriceEvent(dataset);

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            },
            updatePriceEvent(dataset) {

                let object = {};
                object.index = this.index;
                object.price = this.datasetPrice;

                EventBus.$emit('update-dataset-price', object);

                this.tracPriceInUsdConverted = parseFloat(this.datasetPrice) * this.tracPriceInUsd;
            }
        },
        mounted() {

            this.getPriceForTracInUsd();

            this.datasetData = this.dataset;

            if (this.datasetData.dataset && !this.datasetData.price) {
                this.$notify.info({
                    title: 'Status',
                    message: 'Getting price for dataset...'
                });

                this.getPriceForDataset(this.datasetData);

            } else if (this.datasetData.price) {

                this.datasetPrice = this.datasetData.price;

                this.getPriceForTracInUsd2(this.datasetPrice);


            }
        },
        watch: {
            datasetPrice() {
                if(this.datasetPrice !== ''){
                    this.tracPriceInUsdConverted = parseFloat(this.datasetPrice) * this.tracPriceInUsd;
                }
            }
        },
        filters:{
            fromTimestampToHumanReadable(timestamp) {
                let date = new Date(timestamp);

                let day = date.getDate();
                let month = (date.getMonth() + 1).toString();
                let year = date.getFullYear().toString();
                let hour = date.getHours().toString();
                let minute = date.getMinutes().toString();
                let seconds = date.getSeconds();
                switch (1) {
                    case minute.length:
                        minute = `0${minute}`
                        break;
                    case hour.length:
                        hour = `0${hour}`
                        break;
                }
                return `${day}.${month}.${year} at ${hour}:${minute}`
            }
        }
    }
</script>

<style scoped>

</style>
