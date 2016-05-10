(function(){
	'use strict';
	var DATA = ['uestc','zhumin','jumor'];
	var Box = React.createClass({
		getInitialState: function() {
			return {
				listData :this.props.data
			};
		},
		handleUserInput:function(filterText){
			var temp = this.props.data,data = [];
			for(var i in temp){
				var reg = new RegExp(filterText, 'g');
				if(reg.test(temp[i])){
					data.push(temp[i]);
				}
			}
			this.setState({
				listData :data
			});
		},
		render: function() {
			return (
				<div>
					<SearchBar onUserInput={this.handleUserInput} />
					<List listData={this.state.listData} />
				</div>
			);
		}

	});

	var List = React.createClass({
		render: function() {
			return (
				<div  className="result">
					<ul>
					{
						this.props.listData.map(function(data,index){
							return <li key={index}>{data}</li>
						})
					}
					</ul>
				</div>
			);
		}

	});

	var SearchBar = React.createClass({
		handleChange:function(){
			this.props.onUserInput(this.refs.search.value)
		},
		render:function(){
			return (
				<div className="search-input">
					<input ref="search" onChange={this.handleChange} />
				</div>
				)
		}
	});

	ReactDOM.render(
		<Box data={DATA} />,
		document.getElementById('example')
		)
}())
//change

