## LHSK 


##### Team LHSK 입니다.
----------
<u><b>react 및 스프링 버전 정보 기입 필요</b></u>

npm version etc icon으로 세팅 예정

## 프로젝트 세팅


* #### Remote Info - origin: https://github.com/LHSK0107/demo-repository.git
  
     1. git clone 또는 git pull을 통해 원격 저장소로부터 가져오기
  1. 로컬 저장소에서 작업 요소에 따른 브랜치 생성 후, 작업 진행
  1. 작업 완료 후, main 브랜치에 merge하기 위한 PR 요청
  1. Code Review 후, merge assign
  1. 완료 후, issue close 및 프로젝트 내 항목 이동


----------
## 작업 방식 및 정보
  ### Remote Info
  - origin: [LHSK repository](testing)

### Branch Info

  * main 브랜치를 주축으로 각 요소 별 branch를 생성 후, 작업
    - ex) feature/login, feature/header 등 feature/[branch name]으로 부여
    
    - 생성은 git branch 'feature/[branch name]'
    
    - 생성 후, 브랜치 변경은 git checkout 'feature/[branch name]'
    
    - ```tex
      $ git branch feature/header
      $ git checkout feature/header
      Switched to branch 'feature/footer'
      $ git branch -a
      * feature/footer
        main
        remotes/origin/feature/amazing
        remotes/origin/feature/header
        remotes/origin/main
      ```
    
    - 
    
    - 정상적으로 Switched된 경우라도 git branch -a를 통해 현재 어느 브랜치가 선택되어 있는지 확인 후에 작업

### Commit

  * Commit 분류는 간단하게 다음과 같이 구성하며, 추가로 필요한 경우 규칙 생성 (Initial 등)
    - [UPDATE] : 코드 수정 및 변경
    - [STYLE] : 디자인, 애니메이션 관련 변경 사항
    - [ADD] : 신규 파일 추가
    - [FIX] : 잘못된 정보 변경, 문제 수정
    - [DELETE] : 파일 삭제


### PR 요청
  * 작업 후, 해당 브랜치로 원격 저장소에 push
  * Compare & pull request 버튼 클릭 후, write에서 마크다운 형식으로 코멘트를 작성 ( 프리뷰에서 확인 가능)
  * 각 옵션에서 Reviewers를 눌려서 review를 요청할 사람 선택
  * pull request를 수락해줄 Assignees 사람 선택
  * Labels에서는 해당 pr이 이슈를 해결한 것인지, 새로 진행한 것인지 각 작업에 맞는 라벨을 선택하여 클릭
  * 프로젝트에서는 내역에서 LHSK에 맞는 프로젝트 선택
  * 정상적으로 세팅 후, create pull request를 하면 open 문구 나옴
  * 그 후, 프로젝트에 들어가면 No Status에 PR한 내역이 나오게 됨

### PR 이슈 open to close or merged

- PR에서 어떤 요소가 변경되었는지 Commits, Files changed 등 항목에서 확인
- Comment 등 작성 후, 이상 요소가 없다면 merge
- 이 외에도 rebase 등이 가능하나 상황에 맞춰서 진행
- Merge를 confirm하면 open에서 merged라고 변경됨
- 프로젝트에 가면 merged 요소가 있으며 없을경우 프로젝트 Assigned pull request 컬럼 하단에서 'Add item'을 선택한 후, Add from repository를 선택하여 mereged된 항목을 선택 (보라색 아이콘)

### Issue 생성 (수정 중)

- 어떤 부분이 작동하지 않거나 충돌 등의 에러가 발생한 경우뿐만 아니라 meeting 등 각종 이벤트에 대해서 추가 및 선택
- 타이틀은 '[이슈 요소 #number] text'로 진행



### Project 관리

