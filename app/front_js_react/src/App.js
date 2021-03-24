/*
  eslint-disable react/prefer-stateless-function, react/jsx-boolean-value,
  no-undef, jsx-a11y/label-has-for, react/jsx-first-prop-new-line
*/
import React, {Component} from "react";

const uniqid = require('uniqid');

class App extends Component {
    state = {
        items: [],
        searching: false
    }

    componentDidMount() {
        this.loadProductFromServer();
        this.updateWithServer = setInterval(this.loadProductFromServer, 500)
    }

    loadProductFromServer = () => {
        client.getProducts((products) => {
            this.setState({
                items: products
            })
        });
        App.itemsHolder = this.state.items;
    }
    handleSubmitProduct = (data) => {
        this.createProduct(data);
    }
    createProduct = (data) => {
        this.setState({
            items: this.state.items.concat(data)
        }, () => {
            App.itemsHolder = this.state.items;
        })
        client.createProduct(data);

    }
    handleDeleteProduct = (productID) => {
        this.setState({
            items: this.state.items.filter((item) => {
                return item.productID !== productID
            })
        }, () => {
            App.itemsHolder = this.state.items;
        })
        client.deleteProduct({productID: productID});

    }

    handleEditProduct = (data) => {
        this.setState(({
            items: this.state.items.map((item) => {
                if (data.productID === item.productID)
                    return Object.assign({}, data)
                else return item;
            })
        }), () => {
            App.itemsHolder = this.state.items;
        })
        console.log(data)
        client.updateProduct(data);

    }
    static itemsHolder;
    handleSearch = (searchInput) => {
        if (searchInput === '') {
            this.loadProductFromServer();
            this.updateWithServer = setInterval(this.loadProductFromServer, 500);
        } else {
            clearInterval(this.updateWithServer)
            this.setState({
                items: App.itemsHolder
            }, () => {

                this.setState({
                    items: this.state.items.filter((item) => {
                        return item.productName.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1
                    })
                })
            })
        }
    }


    render() {
        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <SearchField onSearch={this.handleSearch}/>
                    <EditableTableList items={this.state.items} onSubmitProduct={this.handleSubmitProduct}
                                       onDeleteProduct={this.handleDeleteProduct}
                                       onEditProduct={this.handleEditProduct}
                    />
                    <ToggleableTableForm onSubmitProduct={this.handleSubmitProduct}/>
                </div>
            </div>
        )
    }
}

class SearchField
    extends Component {
    state = {
        searchInput: ''
    }
    handleSearchOnChange = (event) => {
        this.setState({
            searchInput: event.target.value
        }, () => {
            this.props.onSearch(this.state.searchInput);
        });

    }

    render() {
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <input
                                type='text'
                                value={this.state.searchInput}
                                onChange={this.handleSearchOnChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

class ToggleableTableForm extends Component {
    state = {
        isOpen: false
    }
    handleOpenForm = () => {
        this.setState({
            isOpen: true
        })
    }
    handleCancelForm = () => {
        this.setState({
            isOpen: false
        })
    }
    handleSubmitForm = (data) => {
        this.handleCancelForm();
        this.props.onSubmitProduct(data);
    }

    render() {
        if (this.state.isOpen) {
            return (
                <TableForm onCancelForm={this.handleCancelForm} onSubmitProduct={this.handleSubmitForm}/>
            )
        } else
            return (
                <div className='ui basic content center aligned segment'>
                    <button
                        className='ui basic button icon'
                        onClick={this.handleOpenForm}
                    >
                        <i className='plus icon'/>
                    </button>
                </div>
            )
    }
}

class EditableTableList extends Component {
    render() {
        return (
            <div>
                {
                    this.props.items.map((item) =>
                        <EditableTable key={item.productID || 'DefaultID'} item={item}
                                       onSubmitProduct={this.props.onSubmitProduct}
                                       onDeleteProduct={this.props.onDeleteProduct}
                                       onEditProduct={this.props.onEditProduct}
                        />
                    )
                }
            </div>
        );
    }
}

class EditableTable extends Component {
    state = {
        editFormOpen: false
    }
    handleSubmitProduct = (data) => {
        this.handleCancelForm();
        this.props.onSubmitProduct(data);
    }
    handleEditFormProduct = () => {
        this.setState({
            editFormOpen: true
        })
    }
    handleCancelForm = () => {
        this.setState({
            editFormOpen: false
        })
    }
    handleEditProduct = (data) => {
        this.handleCancelForm();
        this.props.onEditProduct(data);
    }

    render() {
        if (this.state.editFormOpen) {
            return (

                <TableForm item={this.props.item} onSubmitProduct={this.handleSubmitProduct}
                           onCancelForm={this.handleCancelForm}
                           onEditProduct={this.handleEditProduct}
                />
            )
        } else return (
            <Table item={this.props.item} onDeleteProduct={this.props.onDeleteProduct}
                   onEditFormProduct={this.handleEditFormProduct}
            />

        )
    }
}

class Table extends Component {
    state = {}
    handleDeleteProduct = () => {
        this.props.onDeleteProduct(this.props.item.productID)
    }
    handleEditProduct = () => {
        this.props.onEditFormProduct()
    }
    showAllColors = () => {
        let colors = '';
        this.props.item.colorsList.forEach((color, index) => {
            if (index === this.props.item.colorsList.length - 1)
                colors = colors + color.color + '.';
            else
                colors = colors + color.color + ', ';
        })
        return colors;
    }

    render() {


        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.item.productName}
                    </div>
                    <div className='meta'>
                        <p>{this.showAllColors()}</p>
                    </div>
                    <div className='center aligned description'>
                        <h2>
                            {}
                        </h2>
                    </div>
                    <div className='extra content'>
            <span
                className='right floated edit icon'
                onClick={this.handleEditProduct}
            >
              <i className='edit icon'/>
            </span>
                        <span
                            className='right floated trash icon'
                            onClick={this.handleDeleteProduct}
                        >
              <i className='trash icon'/>
            </span>
                    </div>
                </div>

            </div>
        );
    }
}

class TableForm extends Component {
    state = {
        product: {
            productName: this.props.item
                ? this.props.item.productName
                : ''
        },
        colors: this.props.item
            ? this.props.item.colorsList
            : [{id: uniqid() + 'xix', color: ''},]
    }

    handleIncreaseMoreColor = () => {
        this.setState({
            colors: this.state.colors.concat({id: uniqid(), color: ''})
        })
    }
    handleRemoveThisColor = (indexParam) => {
        this.setState({
            colors: this.state.colors.filter((color, index) => {
                return indexParam !== index;
            })
        })
    }
    handleOnChange = (e) => {
        this.setState({
            product: {
                productID: this.state.product.productID,
                productName: e.target.value
            }
        })
    }
    handleOnChangeColor = (inputColor, id) => {
        this.setState({
            colors: this.state.colors.map((color) => {
                if (color.id === id) {
                    return Object.assign({}, color, {
                        id: color.id,
                        color: inputColor
                    })
                } else return color;
            })
        })
    }
    handleSubmitProduct = () => {
        const colorsListWithoutID = [...this.state.colors].map((color) => {
            delete color.id;
            return color
        })
        if (this.props.item) {
            // Update
            this.props.onEditProduct({
                productID: this.props.item.productID,
                productName: this.state.product.productName,
                colorsList: colorsListWithoutID
            })
        } else {
            // Create
            this.props.onSubmitProduct({
                productName: this.state.product.productName,
                colorsList: colorsListWithoutID
            })

        }
    }

    render() {
        const oKClick = this.props.item ? 'Update' : 'Submit'
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='ui form'>
                        <div className='field'>
                            <label>Product</label>
                            <input
                                type='text'
                                value={this.state.product.productName}
                                onChange={this.handleOnChange}
                            />
                        </div>
                        <ColorList colors={this.state.colors}
                                   onIncreaseMoreColor={this.handleIncreaseMoreColor}
                                   onRemoveThisColor={this.handleRemoveThisColor}
                                   onOnChangeColor={this.handleOnChangeColor}
                        />
                        <div className='ui basic content center aligned segment'>
                            <button
                                className='ui small button icon'
                                onClick={this.handleIncreaseMoreColor}
                            >
                                <i className='plus icon'/> More Color
                            </button>
                        </div>
                        <div className='ui two bottom attached buttons'>
                            <button
                                className='ui basic blue button'
                                onClick={this.handleSubmitProduct}
                            >
                                {oKClick}
                            </button>
                            <button
                                className='ui basic red button'
                                onClick={this.props.onCancelForm}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class ColorList extends Component {
    render() {
        return (
            <div>
                {
                    this.props.colors.map((color, index) => (
                        <ColorBlock key={color.id} index={index} id={color.id} color={color}
                                    onIncreaseMoreColor={this.props.onIncreaseMoreColor}
                                    onRemoveThisColor={this.props.onRemoveThisColor}
                                    colors={this.props.colors}
                                    onOnChangeColor={this.props.onOnChangeColor}
                        />
                    ))
                }
            </div>
        )
    }

}

class ColorBlock extends Component {

    handleRemoveThisColor = () => {
        this.props.onRemoveThisColor(this.props.index);
        console.log(this.props.index);
    }
    handleOnChangeColor = (e) => {
        this.props.onOnChangeColor(e.target.value, this.props.id);
    }
    shouldShowMinusIcon = () => {
        return this.props.colors.length > 1;
    }

    render() {
        return (
            <div>
                <div className='field'>
                    <label style={{marginTop: 20 + 'px'}}>Color {this.props.index + 1} &nbsp;
                        {this.shouldShowMinusIcon() &&
                        <button className='ui small basic button icon'
                                onClick={this.handleRemoveThisColor}>
                            <i className='minus icon'/>
                        </button>
                        }
                    </label>

                    <input
                        type='text'
                        value={this.props.color.color}
                        onChange={this.handleOnChangeColor}
                    />
                </div>
            </div>
        )
    }
}

export default App;