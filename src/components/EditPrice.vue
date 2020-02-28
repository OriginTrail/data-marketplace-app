<template>
    <div class="edit-price-dialog">
        <el-dialog
                :visible.sync="priceDialog"
                width="456px"
                :before-close="priceDialogBeforeClose">
            <el-row>
                <el-col :lg="24" :sm="24">
                    <div class="form-wrapper">
                        <h1 class="text-left">Edit Price</h1>
                        <p class="text-left price-description">Changing the price can be done at any time and will only
                            affect the
                            purchases which start after the change. It will not affect the ongoing purchases..</p>
                        <el-form ref="priceEditForm" :model="editPrice" label-width="120px"
                                 :label-position="labelPosition"
                                 class="edit-price-form">
                            <div class="price-wrapper">
                                <el-form-item label="Price is in Trace Token">
                                    <el-input-number
                                            :min=min :max=max
                                            v-model="priceDialogValues.price">
                                    </el-input-number>
                                </el-form-item>
                                <span class="trac-span">TRAC</span>
                            </div>
                            <div class="price-dialog-btn-wrapper">
                                <el-button class="put-on-sale-button price-cancel-btn" type="primary"
                                           @click="priceDialogBeforeClose">CANCEL
                                </el-button>
                                <el-button class="put-on-sale-button " type="primary" @click="putOnSale">EDIT PRICE
                                </el-button>
                            </div>

                        </el-form>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EditPrice",
        props: ['dataset'],
        data() {
            return {
                min: 0,
                max: 100000,
                priceDialog: false,
                priceDialogValues: {
                    price: '',
                    index: ''
                },
                editPrice: {
                    ot_objects: [
                        {
                            price: ''
                        }
                    ],
                    dataset: {
                        name: ''
                    },
                    dataset_name: '',
                    description: '',
                    price: '',
                    terms: ''
                },
                labelPosition: 'top',
                disabled: true,
                node_address: ''
            }
        },
        methods: {
            priceDialogBeforeClose() {
                this.priceDialog = false;
                this.editPrice = {
                    ot_objects: [
                        {
                            price: ''
                        }
                    ],
                    dataset: {
                        name: ''
                    },
                    dataset_name: '',
                    description: '',
                    price: '',
                    terms: ''
                }

                this.priceDialogValues = {
                    price: '',
                    index: ''
                }
            },
            putOnSale() {

                let priceNumber = this.priceDialogValues.price * 1000000000000000000;

                let requestBody = {
                    "data_set_id": this.editPrice.dataset.id,
                    "ot_object_ids": [
                        {
                            "id": this.editPrice.ot_objects[0].id,
                            "price_in_trac": priceNumber.toString()
                        }
                    ]
                };

                axios({
                    method: 'post',
                    url: `https://${window.node_address}:8900/api/latest/private_data/update_price`,
                    data: requestBody,
                    header: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then(response => {

                    if (response.data.status === 'COMPLETED') {

                        this.$notify({
                            title: 'Price edit status',
                            message: 'Dataset price updated successfully!',
                            type: 'success'
                        });
                    } else {
                        this.$notify({
                            title: 'Price edit status',
                            message: 'Something went wrong with updating price!',
                            type: 'error'
                        });
                    }
                    EventBus.$emit('change-price', this.priceDialogValues)
                    this.priceDialogBeforeClose();
                });
            }
        },
        mounted() {
            this.node_address = localStorage.getItem('node_address');
            EventBus.$on('open-edit-price-dialog', (data) => {
                this.priceDialogValues.price = data.ot_objects[0].price / 1000000000000000000;
                this.priceDialogValues.index = data.index;
                this.editPrice = data;
                this.priceDialog = true;
            });

        }
    }
</script>

<style scoped>

</style>
