import React from 'react'
import './home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="theme-color">显示主题色</div>
      <h1>工程化实现主题应用切换</h1>
      <div>使用PostCSS的能力</div>
      <button onClick={() => {
        //  给html根节点 添加属性 data-theme=dark
        const HtmlEle = document.documentElement;
        const theme = HtmlEle.getAttribute('data-theme');
        if (!theme) {
          HtmlEle.setAttribute('data-theme', 'dark')
        } else {
          HtmlEle.removeAttribute('data-theme')
        }
        console.log('切换后--', theme)
      }}>切换主题</button>
    </div>
  )
}

export default Home