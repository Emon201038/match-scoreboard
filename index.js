//dom elements
const addMatchButton = document.querySelector(".another-match");
const resetButton = document.querySelector(".reset");
const deleteMatchButton = document.querySelector(".delete-match");
const allMatch = document.querySelector(".all-matches");

// After adding matches, scroll to the bottom
const container = document.querySelector(".container");
container.scrollTop = container.scrollHeight;

//actions type
const ADD_MATCH = "match/addMatch";
const DELETE = "match/delete";
const INCREMENT = "score/increment";
const DECREMENT = "score/decrement";
const RESET = "score/reset";

//action creator
const increment = (payload) => {
  return {
    type: INCREMENT,
    payload,
  };
};
const decrement = (payload) => {
  return {
    type: DECREMENT,
    payload,
  };
};
const reset = () => {
  return {
    type: RESET,
  };
};
const addMatch = () => {
  return {
    type: ADD_MATCH,
  };
};
const deleteMatch = (id) => {
  return {
    type: DELETE,
    id,
  };
};

//initial state
const initialMatchState = [
  {
    id: 1,
    score: 0,
  },
];

//new match id
const newMatchId = (state) => {
  const matchId = state.reduce((maxId, match) => Math.max(maxId, match.id), -1);
  return matchId + 1;
};

//reducer function
const matchReducer = (state = initialMatchState, action) => {
  switch (action.type) {
    case INCREMENT:
      const newMatchesIncrement = state.map((item) => {
        if (item.id === action.payload.id) {
          return {
            ...item,
            score: item.score + Number(action.payload.value),
          };
        } else {
          return item;
        }
      });
      return newMatchesIncrement;

    case DECREMENT:
      const newMatchesDecrement = state.map((item) => {
        if (item.id === action.payload.id) {
          if (item.score < action.payload.value) {
            return {
              ...item,
              score: 0,
            };
          } else {
            return {
              ...item,
              score: item.score - Number(action.payload.value),
            };
          }
        } else {
          return item;
        }
      });
      return newMatchesDecrement;

    case RESET:
      const resetValue = state.map((item) => ({
        ...item,
        score: 0,
      }));
      return resetValue;

    case ADD_MATCH:
      const id = newMatchId(state);
      return [
        ...state,
        {
          id: id,
          score: 0,
        },
      ];

    case DELETE:
      const deletedItem = state.filter((item) => item.id !== action.id);
      return deletedItem;

    default:
      return state;
  }
};

//store
const store = Redux.createStore(matchReducer);

//actions
addMatchButton.addEventListener("click", () => {
  store.dispatch(addMatch());
});

resetButton.addEventListener("click", () => {
  store.dispatch(reset());
});

const deleteMatches = (id) => {
  if (store.getState().length > 1) {
    store.dispatch(deleteMatch(id));
  }

  console.log(store.getState().length);
};

const increamentHandler = (id, formEl, event) => {
  event.preventDefault();
  const input = formEl.querySelector(".increment-input");
  const value = Number(input.value);

  if (value > 0) {
    store.dispatch(increment({ id, value }));
  }
  input.value = "";
};

const decrementHandler = (id, formEl, event) => {
  event.preventDefault();
  const input = formEl.querySelector(".decrement-input");
  const value = Number(input.value);

  if (value > 0) {
    store.dispatch(decrement({ id, value }));
  }
  input.value = "";
};

//render function
const matchHtml = (match) => {
  return `
    <div
      id="singleMatch"
      class="single-match w-full flex justify-around items-center border-b border-slate-600 h-20"
    >
      <div class="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          id="delete"
          class="delete-match w-6 h-6 text-pink-600 cursor-pointer"
          onclick="deleteMatches(${match.id})"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 class="match-number font-bold text-lg uppercase">Match-${match.id}</h3>

      <form class="increment-form flex flex-col" id="incrementForm" onsubmit="increamentHandler(${match.id},this,event)">
        <label for="increament" class="text-slate-400 text-sm"
          >Increament:</label
        >
        <input
          type="number"
          id="incrementInput"
          class="increment-input max-sm:w-20 sm:w-28 md:36 h-7 rounded bg-slate-500 focus:bg-slate-900 focus:border-blue-500 focus:border focus:outline-none p-3 mt-2"
        />
      </form>
      <form class="decrement-form flex flex-col" id="decrementForm" onsubmit="event.preventDefault();decrementHandler(${match.id},this,event)">
        <label for="increament" class="text-slate-400 text-sm"
          >Decreament:</label
        >
        <input
          type="number"
          id="decrementInput"
          class="decrement-input max-sm:w-20 sm:w-28 md:36 h-7 rounded bg-slate-500 focus:bg-slate-900 focus:border-blue-500 focus:border focus:outline-none p-3 mt-2"
        />
      </form>
      <div
        class="display bg-emerald-500 w-16 h-7 rounded-full mt-7 flex justify-center items-center text-black font-bold"
        id="display"
      >
        ${match.score}
      </div>
    </div>
  `;
};

const render = () => {
  const state = store.getState();
  let elm = ``;

  state.map((item) => (elm += matchHtml(item)));
  return (allMatch.innerHTML = elm);
};
store.subscribe(render);
render();

//actions
