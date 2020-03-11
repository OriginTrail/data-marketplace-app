<template>
    <el-dialog
            :title=title
            :visible.sync="dialogVisible"
            :before-close="closePreviewDataset"
            :close="closePreviewDataset">
        <div class="box-3 custom-box">
            <highlight-code>{{ data }}</highlight-code>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "PreviewDataset",
        props: ['data', 'title'],
        data() {
            return {
                dialogVisible: true
            }
        },
        methods: {
            closePreviewDataset() {
                EventBus.$emit('close-preview-data');
            }
        }
    }
</script>

<style scoped>

    pre {

        margin-bottom: 0px !important;
    }

    .custom-box {
        min-height: 489px;
    }
</style>
