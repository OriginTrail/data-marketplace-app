<template>
    <div class="explore-marketplace-wrapper">
        <el-row>
            <el-col class="hero-section">
                <div class="content-wrapper-custom">
                    <div class="h1-wrapper">
                        <h1>Food Data Marketplace</h1>
                    </div>
                    <el-autocomplete
                            id="search-input"
                            prefix-icon="el-icon-search"
                            class="inline-input"
                            v-model="state2"
                            :fetch-suggestions="querySearch"
                            placeholder="Search the Marketplace"
                            :trigger-on-focus="false"
                            @select="handleSelect"
                    ></el-autocomplete>
                </div>

                <img class="marketplace-banner-img img-fluid" src="images/home-marketplace.png" alt="">
            </el-col>
        </el-row>
        <el-row>
                <div class="marketplace-card-wrapper">
                    <div class="marketplace-card-component-wrapper">
                        <el-row class="cards-row" :gutter="10">
                            <marketplace-card
                                    v-for="(dataset, index) in datasetsData"
                                    :dataset="dataset"
                                    :key="index" :index="index"
                                    v-if="showAll">
                            </marketplace-card>

                            <marketplace-card
                                    :dataset="selectedDatasetFromSearch"
                                    v-if="!showAll">
                            </marketplace-card>
                        </el-row>
                    </div>
                </div>
        </el-row>
    </div>
</template>

<script>

    import MarketplaceCard from "./MarketplaceCardComponent";

    export default {
        data() {
            return {
                datasetsData: [],
                state2: '',
                links: [],
                showAll: true,
                selectedDatasetFromSearch: {},
                tempDatasets: [],
                loading: true
            };
        },
        mounted() {
            this.getDatasets();


            EventBus.$on('update-dataset-price', data => {
                this.datasetsData[data.index].price = data.price;
            });
        },
        methods: {
            querySearch(queryString, cb) {
                var links = this.links;
                var results = queryString ? links.filter(this.createFilter(queryString)) : links;

                // call callback function to return suggestions
                cb(results);
            },
            createFilter(queryString) {
                return (link) => {
                    return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            updateVisibleDataset(object) {
                this.datasetsData[object.index]
            },
            handleSelect(item) {
                this.selectedDatasetFromSearch = this.datasetsData[item.index];
                this.showAll = false;
            },
            getDatasets() {
                axios({
                    method: 'get',
                    url: `https://${window.node_address}:8900/api/latest/private_data/available`
                }).then(response => {

                    if(response.data) {

                        this.datasetsData = response.data;

                        EventBus.$emit('calculate-app-height');

                        this.datasetsData.forEach((row, index) => {

                            let object = {};
                            object.value = row.dataset.name;
                            object.index = index;

                            this.links.push(object);
                        });

                        // this.getPriceForDatasets();

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with loading of data, check connection with node!',
                            type: 'warning'
                        });
                    }

                });
            },
            getPriceForDatasets() {
                this.datasetsData.forEach((dataset, index) => {
                    this.getPriceForDataset(dataset);
                })
            },
            getPriceForDataset(dataset) {
                let requestBody = {};
                requestBody.ot_object_id = dataset.ot_objects[0];
                requestBody.seller_node_id = dataset.seller_node_id;
                requestBody.data_set_id = dataset.dataset.id;

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/private_data/get_price`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(response => {

                    if(response.data) {

                        dataset.handler_id = response.data.handler_id;

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
                    url: `https://${window.node_address}:8900/api/latest/private_data/get_price/result/${dataset.handler_id}`,
                }).then(response => {

                    if(response.data && response.data.status === 'PENDING') {

                        setTimeout(() => {
                            this.checkPriceHandler(dataset);
                        }, 30000);


                    } else if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            title: 'Loading price status',
                            message: 'Price successfully loaded!',
                            type: 'warning'
                        });

                    } else {

                        this.$notify({
                            title: 'Loading status',
                            message: 'Something went wrong with updating price!',
                            type: 'warning'
                        });
                    }

                });
            }
        },
        components: {
            MarketplaceCard,
        },
        watch: {
            state2(val) {
                if(val === '') {
                    this.showAll = true;
                }
            }
        }
    };
</script>


