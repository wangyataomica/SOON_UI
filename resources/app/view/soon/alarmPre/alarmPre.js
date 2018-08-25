/*
 ONOS GUI -- soonAlarmPre View Module
 */

(function (){
    'use strict';
    //refs
    var $log,$scope,$cookiesStore,wss,ps,fs,ks,ls,is;
    //states
    var settingPanel,
        pHeight,
        pStartY,
        content,
        top,
        left,
        right,
        tr,
        wSize = false,
        ds;

    //constants
    var topPdg = 60,
        panelWidth = 540,
        detailsPanelName = 'alarmPre-details-panel',
        settingPanelName = 'alarmPre-setting-panel',
        paraPanelName = 'alarmPre-modelPara-panel',
        alarmPreReq = 'alarmPreDataRequest',
        alarmPreResp = 'alarmPreDataResponse',
        dialogId = 'app-dialog',
        dialogOpts = {
            edge:'right',
            width:400,
            height:1600,
        },
        soonView = 'alarmPre',
        settingContentItem=['name','levelShow','probabilityThreshold','modelType','modelPara'],
        levelShow = [true,true,true,true],
        defaultSetting = {
            name:'default',
            levelShow:['urgent','important','secondary','prompt'],
            probabilityThreshold:0.95,
            modelType:'ANN',
            modelPara:{

            },
        },
        setting = {},
        modelPara = {},
        settingMenuSaved = [],
        ANNPara = ['NNIL','NNOL','NHL','learningRate'];


    /*function createDetailsPanel() {
        detailsPanel = ps.createPanel(detailsPanelName, {
            width: wSize.width,
            margin: 0,
            hideMargin: 0,
        });
        detailsPanel.el().style({
            position: 'absolute',
            top: pStartY + 'px',
        });
        $scope.hideDetailsPanel = function () { detailsPanel.hide(); };
        detailsPanel.hide();
    }*/

    function createSettingPanel() {
        settingPanel = ps.createPanel(settingPanelName, {
            width: wSize.width,
            margin: 0,
            hideMargin: 0,
        });
        settingPanel.el().style({
            position: 'absolute',
            top: pStartY + 'px',
        });
        $scope.hideSettingPanel = function () { settingPanel.hide(); };
        settingPanel.hide();
    }

    function closeSettingPanel(){
        if (settingPanel.isVisible()) {
            $scope.selId = null;
            settingPanel.hide();
            paraPanel.hide();
            return true;
        }
        return false;
    }

    function addSettingCloseBtn(div) {
        is.loadEmbeddedIcon(div, 'close', 26);
        div.on('click', closeSettingPanel);
    }

    function addParaCloseBtn(div) {
        is.loadEmbeddedIcon(div, 'close', 26);
        div.on('click', closePanel);
    }

    function addAddSettingBtn(div){
        is.loadEmbeddedIcon(div,'plus',20);
        div.on('click',createSettingMenu);
    }

    function addDeleteSettingBtn(div,menu){
        is.loadEmbeddedIcon(div,'minus',20);
        div.on('click',deleteSetting(menu));
    }

    /*function setUpDetailsPanel() {
        var container,content closeBtn;

        detailsPanel.empty();
        detailsPanel.width(panelWidth);

        container = detailsPanel.append('div').classed('container', true);

        closeBtn = container.append('div').classed('close-btn', true);
        addDetailsCloseBtn(closeBtn);

        container.append('hr');
        content = container.append('div').classed('content', true);

        function ndiv(cls, tcls) {
            var d = content.append('div').classed(cls, true);
            if (tcls) {
                d.append('table').classed(tcls, true);
            }
        }

        ndiv('alarmPre-name');
        ndiv('right', 'alarmPre-props');

        container.append('hr');
    }*/

    function setUpSettingPanel() {
        var container,closeBtn,settingMenu,topContent,title,addSettingBtn
            ,deleteSettingBtn,settingMenu,settingContent,rightFooter;

        settingPanel.empty();
        settingPanel.width(panelWidth);

        container = settingPanel.append('div').classed('container', true);

        top = container.append('div').classed('top',true);
        closeBtn = container.append('div').classed('close-btn', true);
        addSettingCloseBtn(closeBtn);
        topContent = top.append('div').classed('top-content',true);
        title = topContent.append('div').classed('setting-title',true);

        left = container.append('div').classed('left',true);
        addSettingBtn = left.append('div').classed('addSetting-btn',true);
        deleteSettingBtn = left.append('div').classed('deleteSetting-btn',true);
        addAddSettingBtn(addAddSettingBtn);
        addDeleteSettingBtn(deleteSettingBtn);
        settingMenu = left.append('div').classed('setting-menu-container',true);
        settingMenu.append('table').classed('setting-menu',true);

        right = container.append('div').classed('right',true);
        settingContent = right.append('div').classed('setting-content-container',true);
        settingContent.append('table').classed('setting-content',true);
        rightFooter = right.append('div').classed('setting-footer',true);
        rightFooter.append('div').classed('apply-btn',true).on('click',apply).text('apply');
        rightFooter.append('div').classed('save-btn',true).on('click',save).text('save');
        rightFooter.append('div').classed('cancel-btn',true).on('click',cancel).text('cancel');
    }

    /*function setUpParaPanel(){
        var container,content,closeBtn,OKBtn;

        paraPanel.empty();
        paraPanel.width(panelWidth);

        container = paraPanel.append('div').classed('container',true);

        closeBtn = container.append('div').classed('close-btn',true);
        addParaCloseBtn(closeBtn);

        content = container.append('div').classed('para-content',true);
        form = content.append('form').classed('para-form',true).attr('id','paraForm');
        ANNPara.foreach(function(para){
            form.text(para+':').append('input').attr('type','text').classed('para-input',true).append('br');
        })

        footer = container.append('div').classed('para-footer',true);
        OKBtn = footer.append('div').attr('class','OKBtn-para').attr('form','paraForm').on('click',saveANNPara).text('OK');
    }*/

    function createModelParaContent(){
        var content,form;
        content = ds.createDiv();
        form = content.append('form').classed('para-form',true);

        ANNPara.foreach(function(para){
            form.text(para+':').append('input').attr('type','text').classed('para-input',true).attr('id',soonView+para).append('br');
        });
        return content;
    }

    function configModelPara(){

        function dOK(){
            $scope.modelPara = d3.select('.para-form').serializeArray();
        }
        function dCancel(){
            $log.debug('Canceling',action,'of alarmPre');
        }
        ds.openDialog(dialogId,dialogOpts)
            .setTitle('model parameters config')
            .addContent(createModelParaContent(action))
            .addOK(dOk)
            .addCancel(dCancel)
            .bindKeys();
    }

    /*function addProp(tbody, index, value) {
        var tr = tbody.append('tr');

        function addCell(cls, txt) {
            tr.append('td').attr('class', cls).text(txt);
        }

        addCell('label', friendlyProps[index] + ':');
        addCell('value', value);
    }*/

    function populateSettingLeftContent(settingMenuSaved){
        var contentBody = left.select('.setting-menu').append('tbody');
        settingMenuSaved.foreach(function(item,i){
            contentBody.append('tr').text(item).on('click',showSetting(item));
        })
    }

    function populateSettingRightContent(){
        var contentForm = right.select('.setting-content').append('form').classed('setting-form',true);
        settingContentItem.foreach(function(item,i){
            addSettingItem(contentForm,item);
        })
        /*var btnContainer = right.select('.setting-content').append('div').classed('rightBtn-container',true);
        btnContainer.append('button').classed('rightBtn',true).on('click',apply).text('Apply');
        btnContainer.append('button').classed('rightBtn',true).on('ng-click',save).text('Save');
        btnContainer.append('button').classed('rightBtn',true).on('click',cancel).text('Cancel');*/

    }

    function populateSettingPanel(settingMenuSaved){
        setUpSettingPanel();
        populateSettingLeftContent(settingMenuSaved);
        populateSettingRightContent();

    }

    function apply(){
        $scope.payload.query.setting = $scope.setting;
        sendDataReq($scope.payload);
    }

    function save(){
        $scope.setting = d3.select('setting-form').serializeArray();
        $scope.setting[modelPara] = $scope.modelPara;
        $cookiesStore.put($scope.setting.name,$scope.setting);
        $scope.settingMenuSaved.push($scope.setting.name);
    }

    function cancel(){
        closeSettingPanel();
    }

    function addSettingItem(form,item){
            if(item === 'name'){
                form.append('label').text(item+':').append('input').attr('id',soonView+'name').attr('type','text');
            }
            if(item === 'levelShow'){
                var input = form.append('label').text(item+':');
                for(var i=0;i<4;i++){
                    input.append('input').attr('id',soonView+levelShow[i]).attr('type','checkbox').text(levelShow[i]);
                }
            }
            if(item === 'probabilityThreshold'){
                form.append('label').text(item+':').append('input').attr('id',soonView+'probabilityThreshold').attr('type','text');
            }
            if(item === 'modelType'){
                var select = form.append('label').text(item+':').append('select').attr('id',soonView+'modelType');
                select.append('option').attr('value','ANN').text('ANN');
                select.append('option').attr('value','CNN').text('CNN');
            }
            if(item === 'modelPara'){
                form.append('label').append('div').text('config model parameter').on('click',configModelPara);
            }
    }

    function respDetailsCb(data) {
        $scope.panelData = data.details;
        $scope.selId = data.details.id;
        $scope.ctrlBtnState.selection = data.details.id;
        $scope.$apply();
    }

    function showSetting(item){
        var settingGet;
        if(item === 'default'){
            settingGet = defaultSetting;
        }else{
        settingGet = $cookiesStore.get(item);
        $('#alarmPrename').attr('value',settingGet[name]);
        $('#alarmPreprobabilityThreshold').attr('value',settingGet[probabilityThreshold]);
        $('#alarmPremodelType').attr('selected',true);
        $('#alarmPreNNIL').attr('value',settingGet.modelPara.NNIL);
        $('#alarmPreNNOL').attr('value',settingGet.modelPara.NNOL);
        $('#alarmPreNHL').attr('value',settingGet.modelPara.NHL);
        $('#alarmPrelearningRate').attr('value',settingGet.modelPara.learningRate);
    }}

    function showLevelShowSetting(settingGet){
        if(settingGet.levelShow[0]){
            $('#alarmPreurgent').attr('checked');
        }
        if(settingGet.levelShow[0]){
            $('#alarmPreimportant').attr('checked');
        }
        if(settingGet.levelShow[0]){
            $('#alarmPresecondary').attr('checked');
        }
        if(settingGet.levelShow[0]){
            $('#alarmPreprompt').attr('checked');
        }
    }

    function sendDataReq(payload){
        if(wss.isConnected()){
            if(fs.debugOn('table')){
                $log.debug('Table data REQUEST:',alarmPreReq,payload);
            }
            wss.sendEvent(alarmPreReq,payload);
        }
    }

    angular.moudle('ovSoonAlarmPre',['ngCookies'])
    .controller('OvSoonAlarmPreCtrl',
        ['$log', '$scope', '$http', '$timeout','cookiesStore',
         'WebSocketService', 'FnService', 'KeyService', 'PanelService',
         'IconService', 'UrlFnService', 'DialogService', 'TableBuilderService',

    function (_$log_,_$scope_, $http, $timeout, _wss_, _fs_, _ks_, _ps_, _is_,
              ufs, ds, tbs, _ls_) {
        $log = _$log_;
        $scope = _$scope_;
        wss = _wss_;
        fs = _fs_;
        ks = _ks_;
        ps = _ps_;
        is = _is_;
        ls = _ls_;

        $scope.setting = defaultSetting;
        $scope.modelPara = {};
        $scope.settingMenuSaved = new Array('default');
        $scope.payload = {};
        $scope.refreshTip = 'refresh alarmPre information';
        $scope.startTip = 'start show new alarmPre information';
        $scope.stopTip = 'stop show new alarmPre information';

        var handlers = {};

        handlers[settingResp] = respDetailsCb;
        wss.bindHandlers(handlers);

        tbs.buildTable({
            scope: $scope,
            tag: 'alarmPre',
            sortParams: {
                firstCol: 'timeOccur',
                firstDir: 'asc',
                secondCol: 'alarmPreSource',
                secondDir: 'asc',
            },
            query: {
                alarmPreShow: true,
                setting: $scope.setting,
            }
        });

        $scope.payload = {
            sortParams: $scope.sortParams,
            query: {
                alarmPreShow: alarmPreShow,
                setting: $scope.setting,
            },
        };

        $scope.alarmPreShow = function(action){
            $scope.payload.query.alarmPreShow = action;
            sendDataReq($scope.payload);
        };

        $scope.alarmPreSettingShow = function(){
            populateSettingPanel(settingMenuSaved);
            settingPanel.show();
        };

        $scope.$on('$destroy',function(){
            ks.unbindKeys();
            wss.unbindHandlers();
            ds.closeDialog;
        });

        Object.defineProperty($scope, 'queryFilter', {
            get: function () {
                var out = {};
                out[$scope.queryBy || '$'] = $scope.queryTxt;
                return out;
            },
        });

        $log.log('oVSoonAlarmPreCtrl has been created');
    }])

    .directive('soonAlarmPreSettingPanel',
        ['$rootScope','$window','$timeout','KeyService',
        function($rootScope,$window,$timeout,ks){
            return function(scope){
                var unbindWatch;

                function heightCalc(){
                    pStartY = fs.noPxStyle(d3.select('.tabular-header'),'height')
                                    +topPdg;
                    wSize = fs.windowSize(pStartY);
                    pHeight = wSize.height;
                }

                function initPanel(){
                    heightCalc();
                    createSettingPanel();
                    $log.debug('start to initialize panel!');
                }

                if(scope.onos.browser === 'safari'){
                    $timeout(initPanel);
                }else{
                    initPanel();
                }

                ks.keyBindings({
                    esc: [closePanel,'close the setting panel'],
                    _helpFormat: ['esc'],
                });
                ks.gestureNotes([
                    ['click','select a row'],
                ]);

                //if the window size changed
                unbindWatch = $rootScope.$watchCollection(
                    function(){
                        return{
                            h: $window.innerHeight,
                            w: $window.innerWidth
                        };
                    }
                );
                scope.$on('$destroy',function(){
                    setting = null;
                    unbindWatch();
                    ks.unbindWatch();
                    ds.destroyPanel(settingPanelName);
                })
            }
    }]);
}());