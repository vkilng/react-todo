import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function ActivTsk(props) {
    console.log('ActiveTask Component Rendering ...');
    return(
        <div className='taskbar'>
            <span className='outercircle' style={{marginTop:'13px'}}>
            <span className='innercircle' onClick={()=>props.clicComplete(props.idx)} style={{marginTop:'1px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" className='ticksvg'><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
            </span></span>
            <span className='activtaskcontent' onClick={()=>props.clicComplete(props.idx)}>{props.value}</span>
        </div>
    );
}

function CompTsk(props) {
    console.log('CompletedTask Component Rendering ...');
    return(
        <div className='taskbar'>
            <span className='tickedbubble'>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" style={{display:'block', margin:'auto', marginTop:'6px'}}><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
            </span>
            <span className='comptaskcontent'>{props.value}</span>
        </div>
    );
}

class HeaderBar extends React.Component {
    hideElem(id_) {
        let elemtohide = document.getElementById(id_);
        elemtohide.style.display = 'none';
    }
    showElem(id_) {
        let elemtoshow = document.getElementById(id_);
        elemtoshow.style.display = 'block';
    }
    render() {
        console.log("->Rendered HeaderBar Component");
        return(
            <div>
            <div id='header'>
                <span>{this.props.nofActiveTasks} items left</span>
                <button onClick={()=>{this.showElem('listActiv');this.showElem('listComp');}}>All</button>
                <button onClick={()=>{this.hideElem('listComp');this.showElem('listActiv');}}>Active</button>
                <button onClick={()=>{this.hideElem('listActiv');this.showElem('listComp');}}>Completed</button>
                <button onClick={()=>this.props.clicToClearComp()}>Clear Completed</button>
            </div>
            <div id='listActiv'>
                {this.props.ActArr}
            </div>
            <div id='listComp'>
                {this.props.CompArr}
            </div>
            </div>
        );
    }
}

class TaskInput extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            latestentry:'',
            ActiveTaskCount:0,
            TaskCount:0,
            ActiveTasks:{}, CompletedTasks:{},
            ActiveTasksArr:[], CompletedTasksArr:[] 
        }
    }
    txtAreaAdjst() {
        const elem = document.getElementById('entrytxt');
        elem.style.height = '10px';
        elem.style.height = (elem.scrollHeight-16)+"px";
    }
    clearCompleted() {
        this.setState({CompletedTasks:{}});
        this.setState({CompletedTasksArr:[]});
    }
    setTasktoCompleted(indx) {
        let DummyCompTasks = this.state.CompletedTasks;
        console.log("Copying Task to CompletedTasks and removing from ActiveTasks");
        DummyCompTasks[indx]=this.state.ActiveTasks[indx];
        this.setState({CompletedTasks:DummyCompTasks});
        let DummyActiveTasks2 = this.state.ActiveTasks;
        delete DummyActiveTasks2[indx];
        this.setState({ActiveTasks:DummyActiveTasks2});
        console.log("Copying Task Component to Completed array and removing from Active array");
        let DummyActiveTasksArr2 = this.state.ActiveTasksArr;
        let TaskElem = DummyActiveTasksArr2.find((cmpnt) => {return cmpnt.props.idx==indx;});
        if (TaskElem) {
            let indexInArray = DummyActiveTasksArr2.indexOf(TaskElem);
            DummyActiveTasksArr2.splice(indexInArray,1);
            let DummyCompTasksArr = this.state.CompletedTasksArr;
            DummyCompTasksArr.push(<CompTsk
                key={TaskElem.props.idx.toString()}
                value={TaskElem.props.value}
                idx={TaskElem.props.idx}
                //clicToDelete={(n)=>this.DeleteTask(n)} 
                />);
            this.setState({
                ActiveTasksArr:DummyActiveTasksArr2,
                CompletedTasksArr:DummyCompTasksArr,
                ActiveTaskCount:(this.state.ActiveTaskCount-1)
            });
        };
        return;
    }
    storeEntry() {
        const txtar=document.getElementById('entrytxt');
        if (txtar.value!='') {
            let taskcontent=txtar.value.replace(/\n/g, " ");
            txtar.value=''; txtar.style.height='15px';
            this.setState({
                latestentry:taskcontent,
                ActiveTaskCount:(this.state.ActiveTaskCount+1),
                TaskCount:(this.state.TaskCount+1),
            });
            let DummyActiveTasks = this.state.ActiveTasks;
            DummyActiveTasks[(this.state.TaskCount+1)]={content:taskcontent};
            this.setState({ActiveTasks:DummyActiveTasks});
            let DummyActiveTasksArr=this.state.ActiveTasksArr;
            DummyActiveTasksArr.push(<ActivTsk
                    key={(this.state.TaskCount+1).toString()}
                    value={taskcontent}
                    idx={(this.state.TaskCount+1)}
                    clicComplete={(i)=>this.setTasktoCompleted(i)} />);
            this.setState({ActiveTasksArr:DummyActiveTasksArr});

        }
    }
    render() {
        console.log("--> Rendered TaskInput Component");
        return(
            <div>
                <div id="entry">
                    <span className='outercircle'>
                    <div className='innercircle' onClick={()=>this.storeEntry()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9" className='ticksvg'><path fill="none" stroke="#FFF" strokeWidth="2" d="M1 4.304L3.696 7l6-6"/></svg>
                    </div></span>
                    <textarea id='entrytxt' placeholder='Create a new todo...' onKeyUp={()=>this.txtAreaAdjst()}></textarea>
                </div>
                <div>{this.state.latestentry?<HeaderBar
                    entrytxt={this.state.latestentry}
                    nofActiveTasks={this.state.ActiveTaskCount}
                    ActArr={this.state.ActiveTasksArr}
                    CompArr={this.state.CompletedTasksArr.slice().reverse()}
                    clicToClearComp={()=>this.clearCompleted()} />:null}
                </div>
            </div>
        )
    }
}

const heck = ReactDOM.createRoot(document.getElementById('root'));
heck.render(<React.StrictMode><TaskInput /></React.StrictMode>)