 <!-- 后台功能管理 -->
<template>
    <div class="app-container smBackstageFunction">
        <el-form :model='formInline'>
            <!-- 查询条件 -->
            <ul class="heard-search">
                <li>
                    <span class="rem_tit">接口name：</span>
                    <span class="rem_con">
                        <el-input v-model="formInline.apiName" placeholder="请输入接口name" maxlength="30"></el-input>
                    </span>
                </li>
            </ul>

           <!-- 按钮组 -->
            <el-form-item class="operation-box">
                <el-button type="primary" size="mini" @click.native.prevent="seekApi">
                <!-- <svg-icon icon-class="chaxun" /> -->
                <svg-icon icon-class="chaxun"/> 查询
                </el-button>
                <el-button type="primary" size="mini" @click.native.prevent="reset">
                <svg-icon icon-class="zhongzhi"/> 重置
                </el-button>
                <el-button type="primary" size="mini" @click.native.prevent="addApi">
                <svg-icon icon-class="xinzeng1"/> 新增
                </el-button>
                <el-button type="primary" size="mini" @click.native.prevent="updateApi">
                <svg-icon icon-class="xiugai"/> 修改
                </el-button>
                <el-button type="primary" size="mini" @click.native.prevent='deleteApi'>
                <svg-icon icon-class="shanchu" /> 删除
                </el-button>
                <el-button type="primary" size="mini" @click.native.prevent='apiParticulars'>
                <svg-icon icon-class="chakanxiangqing"/> 查看详情
                </el-button>
                </el-form-item>
            </el-form>

        <!-- table表格 -->
        <div class="role_table">
            <el-table
                :cell-style="rowcellClass"
                :data="tableData"
                :key="11"
                highlight-current-row
                :height="currentPageSize*25 + 44"
                style="width: 100%;"
                class="tableAuto256"
                border
                v-loading="loading"
                @current-change='pitchOnRow'
            >   
                <el-table-column width="35">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row.id" v-model="table_rowDataId" class="hidTextRadio">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column type="index"  label="序号" align="center" :show-overflow-tooltip="true" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.$index+(page - 1) * pageSize + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="接口name" property="name" min-width="130" align="center" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column label="接口code" property="code" min-width="200" align="center" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column label="接口描述" property="description" min-width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column label="创建人" property="createdBy" min-width="110" align="center" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column label="创建时间" property="createdDate" min-width="140" align="center" :show-overflow-tooltip="true" ></el-table-column>
                <el-table-column label="修改人" property="lastModifiedBy" min-width="110" align="center" :show-overflow-tooltip="true" >
                    <template slot-scope="scope">
                        {{scope.row.lastModifiedBy ? scope.row.lastModifiedBy : '-' }}
                    </template>
                </el-table-column>
                <el-table-column label="修改时间" property="lastModifiedDate" min-width="140" align="center" :show-overflow-tooltip="true" ></el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="role_pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="seekFunction"
                background
                :page-sizes="[10, 20, 50, 100]"
                :current-page.sync="page"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="dataListTotal"
            >
            </el-pagination>
        </div>

        <!-- 新增弹窗 -->
        <el-dialog :visible.sync="addApiDialog" title="新增" width="400px" :top="dialogMt" :close-on-click-modal="false">
            <div class="dialog-box">
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口name：
                    </span>
                    <el-input style="width: 200px;" v-model="addData.name" maxlength="30"/>
                </p>
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口code：
                    </span>
                    <el-input style="width: 200px;" v-model="addData.code" maxlength="50"/>
                </p>
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口描述：
                    </span>
                    <el-input style="width: 200px;" type="textarea" :autosize="{ minRows: 2}" v-model="addData.describe" maxlength="50"/>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" :loading="loadingObj.apiAdd" @click="confirmAddApi">确 定</el-button>
                <el-button @click="addApiDialog = false" size="mini">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 删除 -->
        <el-dialog
            :visible.sync="deleteApiDialog"
            title="删除"
            width="350px"
            top="35vh"
            :close-on-click-modal="false"
        >
            <p style="text-align:center;">
                是否确定删除当前选中行，接口名称为
                <span class="required">"{{name}}"</span>的数据？
            </p>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="confirmDelete" :loading="loadingObj.apiDelete">确 定</el-button>
                <el-button size="mini" @click="deleteApiDialog = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 修改弹窗 -->
        <el-dialog :visible.sync="updateApiDialog" title="修改" width="400px" :top="dialogMt" :close-on-click-modal="false">
            <div class="dialog-box">
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口name：
                    </span>
                    <el-input style="width: 200px;" v-model="addData.name" maxlength="30"/>
                </p>
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口code：
                    </span>
                    <el-input style="width: 200px;" v-model="addData.code" maxlength="50"/>
                </p>
                <p>
                    <span class="dialog-label-item userAccount">
                        <span class="required">*</span>接口描述：
                    </span>
                    <el-input style="width: 200px;" type="textarea" :autosize="{ minRows: 2}" v-model="addData.describe" maxlength="50"/>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" :loading="loadingObj.apiUpData" @click="confirmUpData">确 定</el-button>
                <el-button @click="updateApiDialog = false" size="mini">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 查看详情弹窗 -->
        <el-dialog :visible.sync="particulars" title="查看详情" width="500px" top="10vh" :close-on-click-modal="false">
            <el-form :model='addData' class="particulars-form">
                <ul>
                    <li>
                        <span class="title">接口name：</span>
                        {{ addData.name }}
                    </li>
                    <li>
                        <span class="title">接口code：</span>
                        {{ addData.code }}
                    </li>
                    <li>
                        <span class="title">接口描述：</span>
                        {{ addData.describe }}
                    </li>
                    <li>
                        <span class="title">关联页面数：</span>
                        {{ particularsCorrelationCount }}
                    </li>
                </ul>
            </el-form>
            <p class="tree-title">关联页面：</p>
            <!-- 树形控件 -->
            <div class="tree-box">
                <el-tree
                    :expand-on-click-node='false'
                    show-checkbox
                    default-expand-all
                    :data="tree_data"
                    :props="defaultProps"
                    v-loading="loading_tree"
                    node-key="id"
                    :default-checked-keys="checkboxList"
                ></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="particulars = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from "vuex"; // 状态管理
import { findPage , persist, merge, remove, findFuncTree } from '@/api/systemManage/sm_backstage_function'; // 后台功能管理api
import { validOneToThirty, validLetterColon } from '@/utils/validate.js' // 正则验证
export default {
    name:'sm_backstage_function',
    components: { // 组件
    
    },
    computed: { // 计算属性
        ...mapState({ // 获取状态库中的数据
            currentPageSize: state => state.sm_backstage_function.currentPageSize, // 列表数据多展示的高度 
            dataListTotal: state => state.sm_backstage_function.dataListTotal, // 列表总条数
            tableData: state => state.sm_backstage_function.tableData, // 表格数据
        }),
        formInline: { // 查询数据
            get(){
                return this.$store.state.sm_backstage_function.formInline
            },
            set(item){
                return item
            }
        },
        page: { // 当前页码
            get(){
                return this.$store.state.sm_backstage_function.page
            },
            set(item){
                return item
            }
        },
        pageSize: { // 每页显示条数
            get(){
                return this.$store.state.sm_backstage_function.pageSize
            },
            set(item){
                return item
            }
        },
    },
    data() {
        return {
            table_rowDataId: "", // 当前行的ID
            loading: false, // Loading 加载 
            addData: { // 新增数据
                name: "", // 接口name
                code: "", // 接口code
                describe: '' // 接口描述
            },
            addApiDialog: false, // 是否显示新增弹窗
            updateApiDialog: false, // 是否显示修改弹窗
            deleteApiDialog: false, // 是否显示删除弹窗
            particulars: false, // 是否显示查看详情弹窗
            dialogMt: this.dialogMt, // 弹出框上边距
            loadingObj: { // 按钮加载loading
                apiAdd: false,
                apiUpData: false,
                apiDelete: false
            },
            isRow:false, // 是否有选中行  用于修改、删除时判断是否有选中行
            name:'', // 确认删除时用于提示的接口名称
            tree_data: [], // 树形控件数据
            loading_tree: false, // 树形控件loading
            defaultProps: { // 树插件数据格式
                children: "children",
                label: "name",
                parentId: ""
            },
            particularsCorrelationCount:0, // 详情关联页面数
            checkboxList:[], // 树结构默认选中的节点
            zcAddData: { // 暂存当前选中行信息
                name: "", // 接口name
                code: "", // 接口code
                describe: '' // 接口描述
            },
            isClick:false, // 防多点击   false：不可点 true：可以点
        }
    },
    filters: { // 过滤
        
    },
     created() {
        if(this.$store.getters.alreadyClose.includes(this.$store.getters.currentView)) { // 判断已关闭页面列表中是否包含当前打开的页面      
            // 更新已关闭的菜单 数组状态
            let newalreadyClose = [] // 定义一个空数组存 过滤左侧点击的数据
            this.$store.getters.alreadyClose.forEach(value => { // 遍历已关页面
                if(value != this.$store.getters.currentView) { // 已关闭页面不等于当前打开页面
                    newalreadyClose.push(value)
                }
            })
            this.$store.dispatch("updataTabClose",newalreadyClose) // 更新已关闭菜单
            if(this.$store.getters.currentView == this.$route.name) { 
                this.$store.state.sm_backstage_function.tableData = []
                this.$store.state.sm_backstage_function.dataListTotal = 0;
                this.$store.state.sm_backstage_function.page = 1;
                this.$store.state.sm_backstage_function.pageSize = 10;
                this.$store.state.sm_backstage_function.formInline = { apiName: '' }
                this.$store.dispatch('getcurrentPageSize', 2)
            }
        }else { // 不是已关闭页面 切换回当前页面(后台功能管理)时
            if(this.$store.state.sm_backstage_function.tableData.length > 0) { // 判断表格数据是否有数据   有则调用查询方法，确保表格展示数据是最新的
                this.seekFunction() // 调用查询方法
            }
        }
  },
    mounted() { // 生命周期钩子函数   在此函数中做初始化操作
    },
    methods: { // 方法体
        pitchOnRow(currentRow, oldCurrentRow) { // 表格当前行选中事件 currentRow:当前行， oldCurrentRow：旧的当前行
            if(currentRow) {
                this.isRow = true // 选中数据
                this.table_rowDataId = currentRow.id // 当前选中行id
                this.zcAddData.name = currentRow.name // 当前选中行的接口名称
                this.zcAddData.code = currentRow.code // 当前选中行的接口编码
                this.zcAddData.describe = currentRow.description // 当前选中行的接口描述
                this.name = currentRow.name // 当前选中行的接口名称
            }
        },
        nonNullVerify() { // 非空验证
            if(!this.addData.name) { // 接口名称非空验证
                this.$message.warning("接口名称不能为空，接口名称由数字、字母、汉字组成，且长度不能超过30个字符")
                return false
            }
            if(!this.addData.code) { // 接口编码非空验证
                this.$message.warning("接口编码不能为空，接口编码由 字母（大小写）或英文冒号组成，且长度不能超过50个字符")
                return  false
            }
            if(!this.addData.describe) { // 接口描述非空验证
                this.$message.warning("接口描述不能为空，描述长度不能超过50个字符")
                return false
            }
            return true
        },
        tableHeaderColor() {
            // 修改row header的背景颜色与内边距
            return "background-color: #F7FBFE; padding: 4px 0;text-align:center;";
        },
        rowcellClass() {
            // 行的cell样式
            return "padding:0;overflow: hidden !important;white-space: nowrap !important;word-break: keep-all !important;text-overflow: ellipsis !important;";
        },
        addApi() { // 新增按钮点击事件
            this.addApiDialog = true // 显示新增弹窗
            this.addData.name = '' // 清空输入框接口名称
            this.addData.code = '' // 清空输入框接口编码
            this.addData.describe = '' // 清空输入框接口描述
        },
        deleteApi() { // 删除按钮点击事件
            if(this.isRow) { // 判断是否有选中行
                this.deleteApiDialog = true // 显示删除弹窗
            }else { // 没有选中行
                this.$message.warning('请选中一条数据')
            }
        },
        updateApi() { // 修改按钮点击事件
            if(this.isRow) { // 判断是否有选中行
                this.updateApiDialog = true // 显示修改弹窗
                this.addData.name = this.zcAddData.name // 当前选中行的接口名称
                this.addData.code = this.zcAddData.code // 当前选中行的接口编码
                this.addData.describe = this.zcAddData.describe // 当前选中行的接口描述
            }else { // 没有选中行
                this.$message.warning('请选中一条数据')
            }
        },
        handleSizeChange(val) { // 分页 每页条数改变时触发事件
            this.$store.dispatch('getDatasizeTotal', val); // 当前页显示条数存状态
            this.seekFunction(); // 调用查询方法
        },
        seekApi() { // 查找按钮点击事件
            this.seekFunction() // 调用查询方法
        },
        confirmAddApi() { // 确定新增
            if(!this.nonNullVerify()) { // 非空验证
                return
            }
            this.loadingObj.apiAdd = true // 显示按钮加载loading
            let data = { // 接口参数
                name:this.addData.name, // 新增接口名称
                code:this.addData.code, // 新增接口编码
                description:this.addData.describe, // 新增接口描述
            }
            persist(data).then(response => { // 请求api
                let res = response.data
                if(res && res.success == 1 && res.respCode == '10000') { // 判断是否新增成功
                    this.loadingObj.apiAdd = false // 隐藏按钮加载loading
                    this.$message.success(res.respMsg) // 新增成功提示
                    this.addData.name = '' // 清空输入框的接口name
                    this.addData.code = '' // 清空输入框的接口编码
                    this.addData.describe = '' // 清空输入框的接口描述
                    this.addApiDialog = false // 隐藏新增弹窗
                    this.seekFunction() // 调用查询方法
                }else { // 新增失败
                    this.loadingObj.apiAdd = false // 隐藏按钮加载loading
                    this.$message.error(res.respMsg) // 新增失败提示
                }
            })




          
            //     if(!validOneToThirty(this.addData.name)) { // 接口名称格式验证
            //         this.$message.warning("接口名称格式错误，接口名称由数字、字母、汉字组成，且长度不能超过30个字符")
            //         return
            //     }else if(!validLetterColon(this.addData.code)) { // 接口编码格式验证
            //         this.$message.warning("接口编码格式错误，接口编码由 字母（大小写）或英文冒号组成，且长度不能超过50个字符")
            //         return
            //     }else {
            //         let data = { // 接口参数
            //             name:this.addData.name, // 新增接口名称
            //             code:this.addData.code, // 新增接口编码
            //             description:this.addData.describe, // 新增接口描述
            //         }
            //         persist(data).then(response => {
            //             console.log("res========",response)
            //         })
            //     }
            
            
        },
        confirmDelete() { // 确定删除
            this.loadingObj.apiAdd = true // 显示按钮加载loading
            let data = { // 接口参数
                id:this.table_rowDataId, // 当前选中行id
            }
            remove(data).then(response => { // 请求删除api
                let res = response.data
                if(res && res.success == 1 && res.respCode == '10000') { // 判断是否删除成功
                    this.loadingObj.apiAdd = false // 隐藏按钮加载loading
                    this.table_rowDataId = '' // 清除当前选中行id
                    this.$message.success(res.respMsg) // 删除成功提示
                    this.deleteApiDialog = false // 隐藏删除弹窗
                    this.seekFunction() // 调用查询方法
                }else { // 删除失败
                    this.loadingObj.apiAdd = false // 隐藏加载loading
                    this.$message.error(res.respMsg) // 删除失败提示
                }
            })
        },
        confirmUpData() { // 确定修改
            if(this.isClick == true) {
                return
            }
            this.isClick = true // 防多点击
            if(!this.nonNullVerify()) { // 非空验证
                return
            }
            this.loadingObj.apiAdd = true // 显示按钮加载loading
            let data = { // 接口参数
                id:this.table_rowDataId, // 当前选中行id
                name:this.addData.name, // 修改接口名称
                code:this.addData.code, // 修改接口编码
                description:this.addData.describe, // 修改接口描述
            }
            merge(data).then(response => { // 请求修改api
                let res = response.data
                if(res && res.success == 1 && res.respCode == '10000') { // 判断是否修改成功
                    this.loadingObj.apiAdd = false // 隐藏按钮加载loading
                    this.table_rowDataId = '' // 清除当前选中行id
                    this.$message.success(res.respMsg) // 修改成功提示
                    this.addData.name = '' // 清空输入框的接口name
                    this.addData.code = '' // 清空输入框的接口编码
                    this.addData.describe = '' // 清空输入框的接口描述
                    this.isRow = false // 清除选中状态
                    this.updateApiDialog = false // 隐藏修改弹窗
                    this.seekFunction() // 调用查询方法
                }else { // 修改失败
                    this.loadingObj.apiAdd = false // 隐藏按钮加载loading
                    this.$message.error(res.respMsg) // 修改失败提示
                    this.isClick = false // 解除防多点击
                }
            })
        },
        seekFunction(val) { // 查询方法
            if(!val) {
                val = 1;
            }
            this.$store.dispatch("getDatapageTotal",Number(val))   
            this.loading = true // 显示loading
            let data = { // 接口参数
                name:this.formInline.apiName, // 查询名称
                page:this.page -1, // 当前页码 后端页码从0开始
                size:this.pageSize, // 每页条数
            }
            findPage(data).then(response => { // 请求api
                let res = response.data.content // 变量接收回调数据
                if(response && response.data.success == 1) { // 判断请求状态为成功
                    this.loading = false // 隐藏loading
                    this.$store.dispatch('getTableData',res.content) // 表格数据存状态
                    this.$store.dispatch('getDataListTotal',res.totalElements) // 分页总条数存状态
                    this.isClick = false // 解除防多点击
                    let condata = 2
                    if(res.content.length > 1) { // 判断api回调是否有数据
                        condata = res.content.length // 有数据则取数据列表的长度作为表格展开的高度
                    }
                    this.$store.dispatch('getcurrentPageSize',condata) // 表格展开高度存状态

                }else{
                    this.$message.error(response.data.respMsg) // 接口请求失败提示
                    this.isClick = false // 解除防多点击
                }
            }).catch(err => { // 请求超时 报错
                // this.isClick = false // 解除防多点击
            })
        },
        reset() { // 重置按钮点击事件
            this.formInline.apiName = '' // 清空查询条件
        },
        recursion(val) { // 递归方法 val: 树结构子节点列表
             val.forEach(el => { // 循环子节点 
                el.disabled = true // 强制添加禁用属性
                if(el.children) { // 判断子节点下面是否还有子节点   
                    this.recursion(el.children) // 有择调用该方法本身递归循环
                }else { // 没有则跳出递归循环
                    return
                }       
            })
        },
        apiParticulars() { // 查看详情按钮点击事件
            if(this.isRow) { // 判断是否有选中行
                this.addData.name = this.zcAddData.name // 当前选中行的接口名称
                this.addData.code = this.zcAddData.code // 当前选中行的接口编码
                this.addData.describe = this.zcAddData.describe // 当前选中行的接口描述
                this.particulars = true // 显示详情弹窗
            }else { // 没有选中行
                this.$message.warning('请选中一条数据')
                return
            }
            let data = { // 接口参数
                funcId:this.table_rowDataId, // 当前选中行id
            }
            findFuncTree(data).then(response => { // 请求查看详情api
                this.checkboxList = [] // 每次请求api时清空树结构默认选中的节点
                let res = response.data // 变量接收回调数据
                if(response && response.data.success == 1) { // 判断请求状态为成功
                    this.particularsCorrelationCount = res.content.num // 详情关联页面数
                    this.tree_data = res.content.permissionTree // 树形控件数据
                    this.checkboxList = res.content.permissionIdList // 树形控件默认选中的节点id列表
                    this.tree_data.forEach((item, index) => { // 遍历添加禁用属性与默认选中节点
                        item.disabled = true // 禁用
                        if(item.children) { // 判断是否有子节点
                            this.recursion(item.children) // 有子节点择调用递归方法
                        }
                    });
                }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .particulars-form {
        border:1px solid #ebeef5;
        padding: 5px 20px;
        background: #eeeeee;
        ul {
            li {
                line-height: 25px;
            }
        }
    }
    .tree-title {
        line-height: 30px;
    }
    .tree-box {
        border:1px solid #ebeef5;
        height: 50vh;
        overflow-y:auto;
        padding:15px;
    }
</style>
