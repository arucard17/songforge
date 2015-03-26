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
                    <h1><span class="logo mdi-av-hearing"></span>SongForge</h1>
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
                    <h1><span class="logo mdi-av-hearing"></span>SongForge</h1>
                    <p class="lead">Sonidos <span id="addSound" class="btn btn-flab btn-default mdi-av-playlist-add"></span></p>
                </div>
                <div class="animated bounceInLeft bs-component table-container-sound">
                    <table class="table table-striped table-hover ">
                        <thead>
                            <tr>
                                <th width="80%" class="text-center">Nombre</th>
                                <th></th>
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

        // Modal
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
                                    <label for="name" class="col-lg-2 control-label">Nombre</label>
                                    <div class="col-lg-10">
                                        <input type="text" class="form-control" id="name" placeholder="Nombre">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="color" class="col-lg-2 control-label">Color</label>
                                    <div class="col-lg-10">
                                        <input type="text" class="form-control" id="color" placeholder="Ej. #fffeee">
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
        <tr style="background-color:<%=color %>">
            <td class="text-center"><%=name %></td>
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
                    <h1><span class="logo mdi-av-hearing"></span>SongForge</h1>
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
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1 songContainer">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <div class="partitura">
                            <div class="pentagram">
                                <div class="sol"></div>
                                <div class="line"></div>
                                 <div class="line"></div>
                                <div class="line"></div>
                                 <div class="line"></div>
                                <div class="line"></div>
                                 <div class="line"></div>
                                <div class="line"></div>
                                 <div class="line"></div>
                                <div class="line"></div>
                                 <div class="line"></div>
                                <div class="line"></div>
                            </div>
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

    <script type="jquery/template" id="tmpl-compas">
        <div class="compas">
            <span><%=value1 %></span>
            <span><%=value2 %></span>
        </div>
    </script>
    
    {# <div class="note note-9 icon song-icon-negra"></div> #}

    <script type="jquery/template" id="tmpl-division">
        <div class="division note-<%=index%>"></div>
    </script>
    
    <script type="jquery/template" id="tmpl-menu">
        <li class="dropdown">
            <a href="bootstrap-elements.html" data-target="#" class="dropdown-toggle" data-toggle="dropdown"><%=name %> <b class="caret"></b></a>
            <ul class="dropdown-menu">
                <% for(var i in notas){ %>
                    <li class="note-add"> <a title="Negra" data-parent="<%=id %>" data-id="<%=notas[i].id %>"><div class="note icon song-icon-negra"></div></a></li>
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
        <div data-id="<%=sound._id %>" class="animated note note-<%=index %> icon song-icon-negra"></div>
    </script>


{% endblock %}
