<template>
    <el-col :xl="8" :lg="8" :md="12" :sm="24" :xs="24" class="card-col">
        <div class="marketplace-card" v-if="datasetData.dataset">
            <el-row class="main-info-row">
                <el-col :span="15" class="text-left card-left-side">
                    <p class="card-headline">{{ (datasetData.dataset.name === '') ? 'Name not provided' : trimText2(datasetData.dataset.name) }}</p>
                    <span class="issuer">Issuer:
                    </span>
                    <div class="inline-div">
                        <jazzicon :address="datasetData.seller_erc_id" :diameter="20" class="jazzicon-card-style"></jazzicon>
                        <span class="issuer-identity">
                            {{trimText2(datasetData.seller_erc_id)}}
                        </span>
                    </div>
                    <br>
                    <p class="description">Description of the dataset:</p>
                    <p class="description">{{ (datasetData.dataset.description) ? trimText(datasetData.dataset.description) : ' Description not provided' }}</p>
                    <div class="tags">
                        <el-tag type="info" v-for="(tag, index) in datasetData.dataset.tags" v-if="index < 2" :key="index">{{ (tag) ? tag : 'Tag not provided' }}</el-tag>
                    </div>
                </el-col>
                <el-col :span="9" class="card-right-side">
                    <div class="data-img-wrapper" >
                        <div class="preview-data">
                            <img :src="generateImage()" class="img-fluid card-img" alt="">
                            <div class="hover-overlay" @click="openPreviewDataset(datasetData)">
                                <p class="prev-data">Preview Data</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <el-row class="market-card-footer">
                <el-col :xl="8" :md="8" :sm="8" :xs="24" class="text-left">
                    <div class="btn-wrapper" v-if="!datasetData.price">
                        <el-button @click="getPriceForDataset(datasetData)"  class="no-margin" plain type="primary" size="mini">FETCH PRICE</el-button>
                    </div>
                    <div v-else-if="datasetData.price === 'fetching'" class="loading-fetch-price">
                        <i class="el-icon-loading"></i>
                    </div>
                    <div v-else>
                        <span class="token-ammount">{{ (datasetData.price) ? datasetData.price : '' }}  </span> <span class="trac">{{ (datasetData.price) ? "TRAC" : '' }}</span>
                    </div>
                </el-col>
                <el-col  :xl="7" :md="7" :sm="7" :xs="0" class="text-right large-visible" >
                    <div>
                        <el-tooltip class="item" effect="dark" content="Verify on the OriginTrail Network Explorer"
                                    placement="bottom">
                            <a href="" target="_blank" class="check-link" @click="verifyIntegrity"><img
                                    src="images/id-ic-brand-fill-origintrail.png" alt=""></a>
                        </el-tooltip>
<!--                        <el-tooltip class="item" effect="dark" content="Verify on Etherscan" placement="bottom">-->
<!--                            <a href="" target="_blank" class="check-link"><img src="images/id-bc-color-ethereum.png"-->
<!--                                                                               alt=""></a>-->
<!--                        </el-tooltip>-->
                    </div>
                </el-col>
                <el-col  :xl="9" :md="9" :sm="9" :xs="24" class="btn-col">
                    <div class="visible-xs">
                        <el-tooltip class="item" effect="dark" content="Verify on the OriginTrail Network Explorer"
                                    placement="bottom">
                            <a href="" target="_blank" class="check-link"><img
                                    src="images/id-ic-brand-fill-origintrail.png" alt=""></a>
                        </el-tooltip>
<!--                        <el-tooltip class="item" effect="dark" content="Verify on Etherscan" placement="bottom">-->
<!--                            <a href="" target="_blank" class="check-link"><img src="images/id-bc-color-ethereum.png"-->
<!--                                                                               alt=""></a>-->
<!--                        </el-tooltip>-->
                    </div>
                    <div class="btn-wrapper">
                        <button @click="openPreviewDataset(datasetData)"  class="market-card-btn no-margin">PREVIEW DATA</button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <preview-dataset-component v-if="showPreviewDatasetComponent" :dataset="selectedDataset" :index="index"></preview-dataset-component>
    </el-col>
</template>

<script>

    import PreviewDatasetComponent from "./PreviewDatasetComponent";

    export default {
        name: "MarketplaceCard",
        components: {PreviewDatasetComponent},
        props: ['dataset', 'index'],data() {
            return {
                showPreviewDatasetComponent: false,
            datasetData: {},
              selectedDataset: {},
              tagsImages: {},
              tracPriceInUsd:''
          }
        },
        methods: {
            verifyIntegrity(dataset) {
                window.open(`https://explorer.origintrail.io/data-sets/?query=${this.datasetData.ot_objects[0]}&type=id&externalRequest=true&network=marketplacetestnet`, '_blank');
            },
            openPreviewDataset(datasetData){
                this.selectedDataset = datasetData;
                this.showPreviewDatasetComponent = true;
            },
            generateImage() {
                if(this.datasetData.dataset.tags.length === 0) {
                    return 'images/' + this.tagsImages['Other'];
                }
                return 'images/' + this.tagsImages[this.datasetData.dataset.tags[0]];
            },
            trimText(text){
                let length = 60;
                let clamp = '...';
                let node = document.createElement('div');
                node.innerHTML = text;
                let content = node.textContent;
                return content.length > length ? content.slice(0, length) + clamp : content;
            },
            trimText2(text){
                let length = 30;
                let clamp = '...';
                let node = document.createElement('div');
                node.innerHTML = text;
                let content = node.textContent;
                return content.length > length ? content.slice(0, length) + clamp : content;
            },
            getPriceForDataset(dataset) {
                this.datasetData.price = 'fetching';
                this.$forceUpdate();

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

                }).catch((error)=>{
                    console.log(error.response)
                })
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
                        this.datasetData.fetching_price = false;
                        this.datasetData.price = response.data.data.message.price_in_trac / 1000000000000000000;
                        this.$forceUpdate();
                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            },
        },
        mounted() {
            EventBus.$on('close-preview-dataset', () => {
                this.showPreviewDatasetComponent = false;
            });

            this.datasetData = this.dataset;
        },
        created() {
            this.tagsImages = window.tagsImages;
        }
    }
</script>

<style scoped>

</style>
