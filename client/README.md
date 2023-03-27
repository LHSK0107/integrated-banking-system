# I'm Client

프로젝트 Iam의 클라이언트 소개입니다.

### Version (차후 badge로 변경)

- react : 18.2.0
- node : 18.15.0
  - 17은 지원 종료이며, 16의 경우에는 23년 09월 11일에 지원 종료되므로 25년 04월 30일까지 지원하는 18.x버전을 선택하게 되었습니다.
  - 진행하는데 어려움이 있으면 버전을 변경하도록 하겠습니다.

​	이 외 항목에 대한 버전은 node 버전에 의존하기 때문에 생략

## Folder Structure

```react
Client
ㄴ node_modules
ㄴ public
ㄴ src
	ㄴ assets
  	ㄴ images
    ㄴ brand
  ㄴ commons
  ㄴ pages
  ㄴ setup
- App.css
- App.js
- index.js
- .gitignore
- package.json
- package-lock.json
- README.md
```

​	전체적인 client 폴더의 구조는 위와 같으며, 추가적인 부분이나 변동사항에 따라 바뀔 수 있습니다.

- 상태관리는 현재 Context API를 기준으로 하고 있으며, redux 등 변경 시, 마찬가지로 구조가 변경될 수 있습니다.

- TypeScript는 차후 시간적 여유가 있다면 프로젝트를 변경하는 것으로 하며, 타입에 대한 검토는 Prop-Types로 진행을 하겠습니다.

전반적으로 'create-react-app'으로 생성한 구조와 비슷하지만, 'src 폴더' 내부가 기존과 달리 여러 구조로 나누어져있습니다.

#### (1) assets

​	이미지나 로고 등 프로젝트에 사용하는 미디어 소스에 대해 저장하는 공간입니다. 

- images  - 프로젝트에 사용하는 이미지
- brand - I'm logo, icon 등
- Videos

#### (2) commons

​	프로젝트 페이지 전역에서 사용하는 요소에 대해 저장하는 공간입니다.

#### (3) pages

​	프로젝트에 사용하는 각 페이지가 담긴 공간입니다.

- 각 페이지의 이름과 폴더명을 동일시
- 각각의 폴더 내부에는 페이지에서 사용할 Component, Custom Hooks, Models 등이 포함
- Component 폴더 내부에는 컴포넌트 명으로 폴더를 생성하고 안에는 index.js로 구성 => 폴더이름을 기준으로 구분하기 때문

#### (4) setup

​	애플리케이션 설정에 관한 것을 저장하는 공간이며, Context와 인증, Route 등에 대한 내용이 포함됩니다.

#### (5) App.js

​	기존과 동일하게 해당 파일을 바탕으로 웹페이지 구성이 이루어집니다.

#### (6) App.css

​	프로젝트에 관한 전체 디자인에 해당하는 css 파일입니다.

## Hook and Library

​	클라이언트 부분에서의 상태관리로는 redux와 context API+useReducer 가 있으나 클라이언트 단에서 상태관리가 많이 이루어질 것 같지 않고 최근에는 외부 라이브러리인 Redux보다 내장 라이브러리인 context API가 추세인 것 같아서 선택하게 되었습니다. 

#### (1) Context API + useReducer

#### (2) useQuery

​	react 18버전 변경으로 기존 react-query가 아닌 @tanstack/react-query를 사용

#### (3) react-form-hook

#### (4) yup

#### (5) @hookform/resolvers

#### (6) prop-types

#### (7) useMemo (불투명)

​	이 외 공통 기능이 필요한 경우 Custom Hook을 제작하여 진행

## 테스트

각 컴포넌트 등에 대한 테스트는 index.test.js를 만들어서 진행

## 실행 명령어

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
