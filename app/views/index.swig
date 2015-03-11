{% extends 'layout.swig' %}

{% block content %}
    <div id="content"></div>

    <button id="btnAdd" class="btn btn-fab btn-raised btn-success pull-right animated bounceInUp">
        <i class="mdi-content-add"></i>
    </button>

    <script type="jquery/template" id="tmpl-home">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="page-header animated bounceInDown">
                    <h1 id="tables"><span class="logo mdi-av-hearing"></span>SongForge</h1>
                </div>
                <div class="animated bounceInLeft bs-component table-container">
                    <table class="table table-striped table-hover ">
                        <thead>
                            <tr>
                                <th>Autor</th>
                                <th>Fecha</th>
                                <th>Play</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_comp">
                        </tbody>
                    </table>
                <div id="source-button" class="btn btn-primary" style="display: none;">&lt; &gt;</div></div>
            </div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-row">
        <tr>
            <td><%=author %></td>
            <td><%=createdAt %></td>
            <td>
                <button class="btn btn-fab-mini btn-raised btn-sm btn-success">
                    <i class="mdi-av-play-arrow"></i>
                </button>
            </td>
        </tr>
    </script>

    <script type="jquery/template" id="tmpl-new">
        <div class="row">
            <div class="col-lg-10 col-lg-offset-1">
                <div class="page-header header-new">
                    <h1 id="tables"><span class="logo mdi-av-hearing"></span>SongForge</h1>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-2 col-lg-offset-2 soundsContainer">
                <div class="panel panel-success">
                    <div class="panel-heading">
                        <h3 class="panel-title">Sonidos</h3>
                    </div>
                    <div class="panel-body">
                    </div>
                </div>
            </div>
            <div class="col-lg-6 songContainer">
                <div class="panel panel-default">
                    <div class="panel-body">
                    </div>
                    <div class="panel-footer">
                        <div id="volumen" class="slider shor"></div>
                        <button id="play" class="btn btn-fab btn-raised btn-success">
                            <i class="mdi-av-play-arrow"></i>
                        </button>
                        <audio style="display:none" id="my-audio" src="http://example.com/somefile.mp3"></audio>
                    </div>
                </div>
            </div>
        </div>
    </script>

    <script type="jquery/template" id="tmpl-sound-element">
        <a href="#" data-id="<%=id %>" class="btn btn-primary btn-fab btn-raised sound-element">
            <p class="text">
                <%=name.replace(/[0-9]+/,"") %><span class="duracion"><%=name.replace(/[a-zA-Z]+/,"") %></span>
            </p>
        </a>
    </script>

    <script type="jquery/template" id="tmpl-panel-element">
        <div data-id="<%=id %>" class="panel-element">
            <p class="text noselect">
                <%=name.replace(/[0-9]+/,"") %><span class="duracion"><%=name.replace(/[a-zA-Z]+/,"") %></span>
            </p>
            <span id="close" class="btn btn-fab btn-fab-mini btn-raised btn-sm btn-success mdi-navigation-close close-element animated"></span>
        </div>
    </script>


{% endblock %}
