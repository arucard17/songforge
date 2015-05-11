{% extends 'layout.swig' %}

{% block content %}
    <div id="content"></div>

    <button id="btnAdd" class="btn btn-fab btn-raised btn-success pull-right animated bounceInUp">
        <i class="mdi-content-add"></i>
    </button>
    <button id="btnAddSound" class="btn btn-fab btn-raised btn-success pull-right animated bounceInUp">
        <i class="mdi-av-my-library-music"></i>
    </button>


    {# Templates #}

    {# Home #}
    <script type="jquery/template" id="tmpl-home">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="page-header animated bounceInDown">
                    <img src="/img/logo.png" alt="Logo" />
                </div>
                <div class="animated bounceInLeft bs-component table-container">
                    <table class="table table-striped table-hover ">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Fecha</th>
                                <th>Play</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_comp">
                        </tbody>
                    </table>
                </div>
                <ul class="animated bounceInLeft pagination">
                    <li id="pag-inicio-cont"><a id="pag-inicio" href="#">«</a></li>
                    <li id="pag-final-cont"><a id="pag-final" href="#">»</a></li>
                </ul>
            </div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-row">
        <tr>
            <td><%=id %></td>
            <td><%= moment(createdAt).format('DD/MM/YYYY h:mm:ss') %></td>
            <td>
                <a href="#" data-id="<%=id %>" id="playSequence" class="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success mdi-av-play-arrow">
                </a>
                <a href="#" data-id="<%=id %>" id="removeSequence" class="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success mdi-content-backspace">
                </a>
            </td>
        </tr>
    </script>



    {# Sounds #}
    <script type="jquery/template" id="tmpl-sound">
        <div class="row">
            <div class="col-lg-6 col-lg-offset-3">
                <div class="page-header animated bounceInDown">
                    <img src="/img/logo.png" alt="Logo" />
                    <p class="lead">Sonidos <span id="addSound" class="btn btn-flab btn-default mdi-av-playlist-add"></span></p>
                </div>
                <div class="animated bounceInLeft bs-component table-container-sound">
                    <table class="table table-striped table-hover ">
                        <thead>
                            <tr>
                                <th width="40%" class="text-center">Figura</th>
                                <th width="40%" class="text-center">Nota</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">
                        </tbody>
                    </table>
                </div>
                <ul class="animated bounceInLeft pagination">
                    <li id="pag-inicio-cont"><a id="pag-inicio" href="#">«</a></li>
                    <li id="pag-final-cont"><a id="pag-final" href="#">»</a></li>
                </ul>
            </div>
        </div>

        <div class="modal fade" id="modal-sound">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h4 class="modal-title">Agregar sonido</h4>
                    </div>
                    <div class="modal-body" >
                        <form class="form-horizontal">
                            <fieldset>
                                <div class="form-group">
                                    <label for="type" class="col-lg-2 control-label">Figura</label>
                                    <div class="col-lg-10">
                                        <select name="type" id="type"></select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="note" class="col-lg-2 control-label">Nota</label>
                                    <div class="col-lg-10">
                                        <select name="note" id="note"></select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="soundFile" class="col-lg-2 control-label">File</label>
                                    <div class="col-lg-10">
                                        <input type="text" readonly="" class="form-control floating-label" placeholder="Buscar...">
                                        <input type="file" id="soundFile" multiple="">
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
                        <button type="button" id="saveSound" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-row-sound">
        <tr>
            <td class="text-center">
                <div class="icon <%=Type.class%>"></div>
            </td>
            <td class="text-center"><%=Note.name %></td>
            <td class="actions">
                <a href="#" data-id="<%=id %>" id="playSound" class="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success mdi-av-play-arrow">
                </a>
                <a href="#" data-id="<%=id %>" id="removeSound" class="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success mdi-content-backspace">
                </a>
            </td>
        </tr>
    </script>



    {# Composer #}
    <script type="jquery/template" id="tmpl-new">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="page-header header-new">
                    <img src="/img/logo.png" alt="Logo" />
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="navbar navbar-default">
                    <div class="navbar-header">
                        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                            <span class="icon-bar"></span>
                        </button>
                    </div>
                    <div class="navbar-collapse collapse navbar-responsive-collapse">
                        <ul class="nav navbar-nav">
                        </ul>
                        <form class="navbar-form navbar-right">
                            <select id="compas" class="form-control col-lg-10"></select>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1 songContainer">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="partitura">
                        </div>
                    </div>
                    <div class="panel-footer">
                        <div id="volumen" class="slider shor"></div>
                        <button id="play" class="btn btn-fab btn-raised btn-success">
                            <i class="mdi-av-play-arrow"></i>
                        </button>
                        <button id="save" class="btn btn-primary btn-raised pull-right">Guardar<div class="ripple-wrapper"></button>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-pentagrama">
        <div data-pent="<%=index %>" class="pentagram">
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-pentagrama-clave">
        <div data-pent="<%=index %>" class="pentagram">
            <div class="clave <%=clave %>"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
             <div class="line vis"></div>
            <div class="line"></div>
        </div>
    </script>
    
    <script type="jquery/template" id="tmpl-compas">
        <div class="compas">
            <span><%=name.split("/")[0] %></span>
            <span><%=name.split("/")[1] %></span>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-division">
        <div class="division note-<%=index%>"></div>
    </script>

    <script type="jquery/template" id="tmpl-compas-option">
        <option value="<%=id %>" ><%=name %></option>
    </script>
    
    <script type="jquery/template" id="tmpl-menu">
        <li class="dropdown">
            <a href="bootstrap-elements.html" data-target="#" class="dropdown-toggle" data-toggle="dropdown"><%=name %> <b class="caret"></b></a>
            <ul class="dropdown-menu">
                <% for(var i in Sounds){ %>
                    <li class="note-add"> <a title="<%=Sounds[i].type.name %>" data-parent="<%=id %>" data-id="<%=Sounds[i].id %>"><div class="note icon <%=Sounds[i].type.class %>"></div></a></li>
                <% } %>
            </ul>
        </li>
    </script>
    

    <script type="jquery/template" id="tmpl-sound-element">
        <a href="#" data-id="<%=id %>" class="btn btn-primary btn-fab btn-raised sound-element">
            <p class="text">
                <%=name.replace(/[0-9]+/,"") %><span class="duracion"><%=name.replace(/[a-zA-Z]+/,"") %></span>
            </p>
        </a>
    </script>

    <script type="jquery/template" id="tmpl-panel-element">
        <div data-id="<%=sound._id %>" class="animated note note-<%=index %> icon <%=sound.type.class %>"></div>
    </script>


{% endblock %}
