# use-meteor
React hooks based simpleddp for a meteor backend.

# Installation
`npm install use-meteor`

# How to use

Wrap your top level component in your app with `MeteorProvider`

```
import { MeteorProvider } from 'use-meteor';

const connectUrl = 'localhost:3000';

function App() {

  return (
    <div className="app">
      <MeteorProvider endpoint={connectUrl}>
        {...rest}
      </MeteorProvider>
    </div>
  );
}
```

## API

1. `useConnectionState` - current connection state (true/false)

```
import { useConnectionState } from 'use-meteor';

function DemoComponent() {
    const connected = useConnectionState();
}
```

2. `useSubscription` - function to subscribe to publications

```
import { useSubscription } from 'use-meteor';

function DemoComponent() {
    const ready = useSubscription('messages', [args]);
}
```

3. `useCollection` - returns latest collection data on the client
```
import { useCallback } from 'react';
import { useCollection } from 'use-meteor';

function DemoComponent() {
    const filter = useCallback(group => group.chatId == chatId, [chatId]);
    const messages = useCollection('messageList', filter);
}
```

4. `useCollectionOne` - returns single first item from the collection
```
import { useCallback } from 'react';
import { useCollection } from 'use-meteor';

function DemoComponent() {
    const filter = useCallback(group => group.chatId == chatId, [chatId]);
    const message = useCollectionOne('messageList', filter);
}
```

5. `useMethod` - call a method on the server
```
import { useMethod } from 'use-meteor';

function DemoComponent() {
    const call = useMethod();
    
    const submitFunction = async (data1,data2) => {
        await call('someMethod', data1, data2, ...rest);
    }
}
```

6. `useLogin`, `useLogout` - returns functions that login/logout the user. 
```
import { useLogin, useLogout } from 'use-meteor';

function DemoComponent() {
    const login = useLogin();
    const logout = useLogout();
    
    const loginThenLogout = async (email,password) => {
        await login(email,password);
        await logout();
    }
}
```

7. `useCurrentUser` - returns the current logged in user and logging in state.
```
import { useCurrentUser } from 'use-meteor';

function DemoComponent() {
    const [user,loggingIn] = useCurrentUser();
}
```


8. `useStore` - `zustand` based state storage, mainly used in internally, but also available to inspect outside

```
import { useStore } from 'use-meteor';

function DemoComponent() {
    const connected = useStore(state => state.connected);
}
```

Available state values -

```
const state = {
   connected: <true/false>,
   userId: <null/string>,
   userToken: <null,string>,
   user: <null,Object>,
   loggingIn: <true/false>
}
```
