/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
// document.addEventListener('deviceready', main);

localStorage.setItem('view', 'login')

if(localStorage.getItem('view') == 'login')
{
    localStorage.clear()
    sessionStorage.clear()
}

const GLOBALS = {
    baseUrl: window.location.origin + 'unip/app/www/'
   ,baseUrlService: window.location.origin + '/unip/service/'
   ,meses: {
        nome:  ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
   }
   ,Today: new Date()
}

$(function(){
    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    MeuBrecho = {
       data: {
            logado: false
            ,usuario: null
        } 
        ,save: function(){
            localStorage.setItem('data', JSON.stringify(this.data))
        }
        ,get: function(){
            return JSON.parse(localStorage.getItem('data'))
        }
        ,sair: function(){
            this.data.logado = false
            this.data.usuario = null
            this.save()
        }
    }

    MeuBrecho.save();

    loadView('lista')
    
    $('#btnUserMenu').click(function(){
        if(MeuBrecho.get().logado)
        {
            $('#ulUserMenu').html('')
            $('#ulUserMenu').append("<li><a class='dropdown-item' href='#' onclick=loadView('meuperfil')>Meu Perfil</a></li>")
            $('#ulUserMenu').append("<li><a class='dropdown-item' href='#' onclick=loadView('meusprodutos')>Meus Produtos</a></li>")
            $('#ulUserMenu').append("<li><a class='dropdown-item' href='#' onclick=loadView('mensagens')>Mensagens</a></li>")
            $('#ulUserMenu').append('<li><a class="dropdown-item" href="#" onclick=sair()>Sair</a></li>')
            return
        }
        $('#ulUserMenu').html('')
        $('#ulUserMenu').append('<li><a class="dropdown-item" href="#" onclick=loadView("login")>Entrar</a></li>')
        $('#ulUserMenu').append('<li><a class="dropdown-item" href="#" onclick=loadView("registrar")>Registrar</a></li>')
        return
    })

    $('body').on('click', '.cardproduto', function(){
        loadView('produto')
    })
})

function loadView(view){
    $('#view').html('')
    $.get(view + '.html', function(data){
        $('#view').html(data)
    })
}

function sair(){
    MeuBrecho.sair()
    loadView('lista')
}

$.requestService = function({route, method = 'GET', data = {}, resource = null, async = true} = {}, callback){

    let config = {
        url: GLOBALS.baseUrlService + route
        ,type: method
        ,contentType: 'application/json'
        ,data: JSON.stringify({data: data, resource: resource})
        ,async: async
        ,dataType: 'json'
        ,success: function(response){
            callback(response)
        }
        ,error: function(request){
            $.notify({message: 'Wooops! Não foi possível fazer isso'},{type: 'danger'})
        }
        ,complete: function(request)
        {
            let notificacaoMensagem = ''
            if(request.responseJSON.message.length > 0)
            {
                $.each(request.responseJSON.message, function(index, mensagem) {
                    notificacaoMensagem += mensagem + '; '
                })
                $.notify({message: notificacaoMensagem},{type: request.responseJSON.status ? 'success' : 'danger'})
            }
        }

    }
    config.headers = route !== 'Login' ? {'Authorization': 'Bearer ' + localStorage.getItem('token')} : null

    $.ajax(config)
}