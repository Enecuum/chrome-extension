import React, {Component, Fragment} from 'react'
import {observer} from "mobx-react";

@observer // У Компонета с этим декоратом будет автоматически вызван метод render, если будут изменены observable на которые он ссылается
export default class App extends Component {

}

