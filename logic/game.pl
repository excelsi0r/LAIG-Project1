:-include('board.pl').
:-include('players.pl').

:- 	dynamic
	state/1.

%game state
state(_).

%============================================================================
%initial predicate to play the game
start(_):- 	

					write('Welcome to the Gardens of IO.'), nl,
					write('Available types: '),nl,nl,
					write('  "pp"     - Player VS Player'), nl,
					write('  "greedy" - Player VS Greedy Computer'),nl,
					write('  "easy"   - Player VS Easy Computer'),nl,
					write('  "cc"     - Computer VS Computer'),nl,nl,
					write('Type: '),
					read(A),
					start_game(A).
					
%============================================================================
%start game of type pp, greedy, easy, cc and error.
start_game(TYPE):- 
					TYPE == 'pp',	
					initialize(_),
					display_game(_),
					cycle_pp(_).
				
start_game(TYPE):-
					TYPE == 'greedy',			
					initialize(_),
					display_game(_),		
					cycle_greedy(_).

start_game(TYPE):-	
					TYPE == 'easy',
					initialize(_),
					display_game(_),		
					cycle_easy(_).
				
start_game(TYPE):-	
					TYPE == 'cc',
					initialize(_),
					display_game(_),		
					cycle_cc(_).

start_game(_):- 	print('Invalid Game Type'), nl.

%============================================================================	
%cycle player vs player			
cycle_pp(_):- 	
				get_state(STATE), 		
				process_pp(STATE).

%process game state, play accordingly and cycle
process_pp(STATE):-		STATE \= 'end',
						play_pp(_),
						cycle_pp(_).
						
process_pp(_):-	write('Game has ended'), nl.

%============================================================================	
%cycle greedy, P1 is Player and Greedy computer play is Player 2							
cycle_greedy(_):-	
					get_state(STATE), 		
					process_greedy(STATE).	

%process game state, play accordingly and cycle
process_greedy(STATE):-	STATE \= 'end',
						play_greedy(_),
						cycle_greedy(_).
						
process_greedy(_):-	write('Game has ended'), nl.		
					
%============================================================================
%cycle easy, P1 is Player and Easy computer play is Player 2
cycle_easy(_):- 
				get_state(STATE), 		
				process_easy(STATE).	

%process game state, play accordingly and cycle				
process_easy(STATE):-	STATE \= 'end',
						play_easy(_),
						cycle_easy(_).	
						
process_easy(_):-	write('Game has ended'), nl.

%============================================================================
%cycle computer vs computer both greeedy
cycle_cc(_):-	
				get_state(STATE), 		
				process_cc(STATE).

%process game state, play accordingly and cycle				
process_cc(STATE):-	STATE \= 'end',
					play_cc(_),
					cycle_cc(_).
					
process_cc(_):-	write('Game has ended'), nl.
%============================================================================
%convert flower to number
convert_flower_number(F, FN):- 	F == 'w', FN is 1.
convert_flower_number(F, FN):- 	F == 'y', FN is 2.
convert_flower_number(F, FN):- 	F == 'g', FN is 3.
convert_flower_number(F, FN):- 	F == 'b', FN is 4.
convert_flower_number(F, FN):- 	F == 'p', FN is 5.
convert_flower_number(F, FN):- 	F == 'r', FN is 6.
convert_flower_number(_, FN):- 	FN is -1.

%============================================================================							
%initializations, sets state start while loading, resets board, players to default
%sets 3 trees random on board, distribute 27 flowers to each player.
%place player 1 and player 2 in intial positions and set state p1.
initialize(_):- 	

				%set loading/start state 
				set_state_start(_),	
				print_state(_),
				
				%reset content
				reset_board(_),
				reset_players(_),
				
				%place 3 random 3 in board and
				%distribute random 27 of 60 to each player from the case
				place_trees(3),
				distribute_flowers(27,60),
				
				%initial positions for player 1 and player 2
				place_p1(11,2),
				place_p2(11,3),
				
				%set state p1
				set_state_p1(_).

%============================================================================
%display everything
display_game(_):- 	print_state(_),
					display_table(_),
					display_p1_case(_),
					display_p1_score(_),
					nl,
					display_p2_case(_),
					display_p2_score(_).	
					
%============================================================================
%play CC reads X, Y and Flower, checks if values are valid and plays,
play_pp(_):- 						
							write('Insert New X coordinate:'), read(X),
							write('Insert New Y coordinate:'), read(Y),
							write('Insert New Flower (y, w, r, p, b, g):'), read(F),
							
							integer(X),
							integer(Y),
							
							XPlay is X + 2, YPlay is Y + 2,
							
							convert_flower_number(F, Flower),	
							
							get_state(STATE),							
							eval_play(XPlay, YPlay, Flower, STATE).
							
play_pp(_):-	write('Invalid Values Input, try again...'),nl.

%evaluate evey value given and play if is player 1 or player 2 turn
eval_play(X, Y, Flower, STATE):-	X > 1, X < 11, Y > 1, Y < 11,
									Flower \= -1, STATE == 'p1',
									
									play_p1(X, Y, Flower).
								
eval_play(X, Y, Flower, STATE):-	X > 1, X < 11, Y > 1, Y < 11,
									Flower \= -1, STATE == 'p2',
									
									play_p2(X, Y, Flower).
				
eval_play(_, _, _, _):-	write('Invalid Coords to place'), nl.
							
%================================================================================================	
%play greedy type of game
play_greedy(_):-	
					get_state(STATE),
					eval_greedy(STATE).
%checks if is player 1 turn or the machine turn (p2)			
eval_greedy(STATE):-	STATE == 'p1',
						play_pp(_).
						
eval_greedy(STATE):-	STATE == 'p2',
						greedy_play(_).
						
eval_greedy(_).

%give any key to let the computer play
greedy_play(_):-	write('Greedy computer turn, press any key to compute play: '), read(_),
					get_state(STATE),
					get_greedy_and_play(STATE,_,_,_).

%Creates a greedy play and simulates as if it was the player2 playing.
get_greedy_and_play(STATE, XPlay, YPlay, Flower):-	

								STATE == 'p2',
								get_player2(X, Y, P2),
								get_player1(_,_,P1),
								get_list_of_plays(X,Y, List),
								
								(List == [] -> write('Player 2 cant play, game ended, '), halt(0);
								
								get_greedy_play(List, XPlay, YPlay, Flower),
								
								
								delete_flower_p2(Flower),
								place_elem_table(XPlay, YPlay, Flower),									
								calculate_score(XPlay, YPlay, Flower, Scorelist),
								length(Scorelist, Score),
								update_score_p2(X, Y, P2, Score, P1),
								set_state_p1(_),
								check_scores_and_set_state(Flower),
								display_game(_)).						
							
get_greedy_and_play(_,XPlay, YPlay, Flower):- 	write('Computer should not play Here'), nl,
												XPlay is 100,
												YPlay is 100,
												Flower is 100.

%creates a list with all the possible plays, combining all X,Y coordenates possible to play with each flower type available 
%in the case of player 2. simulates the score of every play, gets the one with the biggest simulated score and returns that play
get_greedy_play(List, XPlay, YPlay, Flower):-	
												case_p2(AvailableFlowers),
												sort(AvailableFlowers, Fs),
												
												combine_lists(List, Fs, List1),
												append(List1, [], Plays),
												
												%print(Plays), nl,
												simulate_plays(Plays, ScoreList),
												
												%print(Scorelist), nl,
												max_member(Biggest, ScoreList),
												
												nth1(Index, ScoreList, Biggest),
												
												nth1(Index, Plays, Play),
												
												get_x_y_flower(Play, XPlay, YPlay, Flower).
											
												
%==============================================================================================
%easy play mode
play_easy(_):-		
				get_state(STATE),
				eval_easy(STATE).

%checks if p1 (user plays), or p2 (computer turn)				
eval_easy(STATE):-		STATE == 'p1',
						play_pp(_).
						
eval_easy(STATE):-		STATE == 'p2',
						easy_play(_).
						
eval_easy(_).	

%any input to let the computer play as if it was player 2
easy_play(_):-		write('Easy Computer turn, press any key to compute play: '), read(_),
					get_state(STATE),
					get_easy_and_play(STATE,_,_,_).

%random gives an available play and plays as if it was player 2 turn					
get_easy_and_play(STATE, XPlay, YPlay, Flower):-		

								STATE == 'p2',
								get_player2(X, Y, P2),
								get_player1(_,_,P1),
								get_list_of_plays(X,Y, List),
								
								(List == [] -> write('Player 2 cant play, game ended, '), halt(0);
								get_easy_play(List, XPlay, YPlay, Flower),
								
								delete_flower_p2(Flower),
								place_elem_table(XPlay, YPlay, Flower),									
								calculate_score(XPlay, YPlay, Flower, Scorelist),
								length(Scorelist, Score),
								update_score_p2(X, Y, P2, Score, P1),
								set_state_p1(_),
								check_scores_and_set_state(Flower),
								display_game(_)).						
							
get_easy_and_play(_,XPlay, YPlay, Flower):- 	write('Computer should not play Here'), nl,
												XPlay is 100,
												YPlay is 100,
												Flower is 100.

%creates a list with all the possible plays, combining all X,Y coordenates possible to play with each flower type available type
%in the case of player 2. returns a rndom play from that list
get_easy_play(List, XPlay, YPlay, Flower):-	
												case_p2(AvailableFlowers),
												sort(AvailableFlowers, Fs),
												
												combine_lists(List, Fs, List1),
												append(List1, [], Plays),
												
												length(Plays, Inteiro),
								
												FloatNum is float(Inteiro),
												
												random(1.0, FloatNum, I),
												
												Index is integer(I),
												
												nth1(Index, Plays, Play),
												
												get_x_y_flower(Play, XPlay, YPlay, Flower).
												
%================================================================================================
%play cc type
play_cc(_):-					
				get_state(STATE),
				eval_cc(STATE).
%evals if p1 or p2 state plays accordingly					
eval_cc(STATE):-		STATE == 'p1',
						greedy_c1(_).
						
eval_cc(STATE):-		STATE == 'p2',
						greedy_play(_).

%Creates a greedy play and simulates as if it was the player1 playing.					
greedy_c1(_):-		write('Greed Computer 1 turn, press any key to compute play: '), read(_),
					get_state(STATE),
					get_greedy_and_play_c1(STATE).
					
get_greedy_and_play_c1(STATE):-	
								STATE == 'p1',
								get_player1(X, Y, P1),
								get_player2(_,_,P2),
								get_list_of_plays(X,Y, List),
								
								(List == [] -> write('Player 1 cant play, game ended, '), halt(0);
								
								get_greedy_play_c1(List, XPlay, YPlay, Flower),
								
								
								delete_flower_p1(Flower),
								place_elem_table(XPlay, YPlay, Flower),									
								calculate_score(XPlay, YPlay, Flower, Scorelist),
								length(Scorelist, Score),
								update_score_p1(X, Y, P1, Score, P2),
								set_state_p2(_),
								check_scores_and_set_state(Flower),
								display_game(_)).						
							
get_greedy_and_play_c1(_):- 	write('Computer should not play Here'), nl.

%creates a list with all the possible plays, combining all X,Y coordenates possible to play with each flower type available type
%in the case of player 1. simulates the score of every play, gets the one with the biggest simulated score and returns that play
get_greedy_play_c1(List, XPlay, YPlay, Flower):-	
												case_p1(AvailableFlowers),
												sort(AvailableFlowers, Fs),
												
												combine_lists(List, Fs, List1),
												append(List1, [], Plays),
												
												%print(Plays), nl,
												simulate_plays(Plays, ScoreList),
												
												
												%print(Scorelist), nl,
												max_member(Biggest, ScoreList),
												
												nth1(Index, ScoreList, Biggest),
												
												nth1(Index, Plays, Play),
												get_x_y_flower(Play, XPlay, YPlay, Flower).
											
%================================================================================================
%AI COMPONENT
%combine every element of first list with each element of the second
combine_lists(_, [], _).	
combine_lists(List, [Flower | Rest], Plays):- 	
												combine_flower(List, Flower, List1),
												combine_lists(List, Rest, List2),
												append(List1, List2, Plays).

%combine flower with every play												
combine_flower([],_,_).
combine_flower([[X | Y] | Rest], Flower, List):-	append([X], [Y], Point),
													append(Point, [Flower], Play),
													
													combine_flower(Rest, Flower, List2),
													append(List2, [Play], List).

%creates new list with the index correspondig to the score of the same index play in the plays list
simulate_plays([], Index):-	append([],[], Index).	
simulate_plays([Play | Rest], Index):-	
										simulate_board_play(Play, Score),
										simulate_plays(Rest, List1),
										append([Score],List1, Index).
										
%simulate a play in the board and returns score									
simulate_board_play(Play,Score):-	
											get_x_y_flower(Play, X, Y, Flower),
											calculate_score(X, Y, Flower, S),
											length(S, Score).
											
%from a play get X, Y and flower value
get_x_y_flower([X1 | Rest], X, Y, Flower):-	X is X1,
											get_y_flower(Rest, Y, Flower).

%from a play get y and flower value											
get_y_flower([Y1 | Rest], Y, Flower):-	Y is Y1,
										get_flower(Rest, Flower).

%from a play get flower value										
get_flower([Flower1 | _], Flower):-	Flower is Flower1.
							
							

%================================================================================================
%player 1 move play
play_p1(XPlay,YPlay,Flower):-
								
								get_player1(X,Y,PlayerStat),								
								get_list_of_plays(X,Y,List),	
								(List == [] -> write('Player 1 cant play, game ended, '), halt(0);
								get_player2(_,_, P2),
								
								check_if_valid_position(XPlay,YPlay,List,ValPosition),
								check_if_flower_exists_p1(Flower, ValFlower),							
								process_p1(XPlay,YPlay,Flower,X,Y,PlayerStat,P2,ValPosition, ValFlower)).
								
%chekc if Flower exists in player 1 case, and if coordenates are valid 
%(is valid if values exist in the list of every play possible)
%if able to play, deletes flower from p1 case, places flower in board,
%calculates the score of player 1, moves in the board accordingly, sets state p2,
%checks if game ended and displays
			
process_p1(_,_,_,_,_,_,_,ValPosition, _):-	

								ValPosition == 'false',
								write('Invalid Position to Play'), nl.
								
process_p1(_,_,_,_,_,_,_,_, ValFlower):-		

								ValFlower == 'false',
								write('Flower inexistent in Case'), nl.
								
process_p1(XPlay,YPlay,Flower,X,Y,PlayerStat,P2,_, _):-
							
								delete_flower_p1(Flower),
								place_elem_table(XPlay, YPlay, Flower),									
								calculate_score(XPlay, YPlay, Flower, Scorelist),
								length(Scorelist, Score),
								update_score_p1(X, Y, PlayerStat, Score, P2),
								set_state_p2(_),
								check_scores_and_set_state(Flower),
								display_game(_).
								
%================================================================================================
%player 2 move play
play_p2(XPlay,YPlay,Flower):-
								
								get_player2(X,Y,PlayerStat),								
								get_list_of_plays(X,Y,List),
								(List == [] -> write('Player 2 cant play, game ended, '), halt(0);
								get_player1(_,_, P1),
								
								check_if_valid_position(XPlay,YPlay,List,ValPosition),
								check_if_flower_exists_p2(Flower, ValFlower),							
								process_p2(XPlay,YPlay,Flower,X,Y,PlayerStat,P1,ValPosition, ValFlower)).

%chekc if Flower exists in player 2 case, and if coordenates are valid 
%(is valid if values exist in the list of every play possible)
%if able to play, deletes flower from p2 case, places flower on board,
%calculates the score of player 2, moves in the board accordingly, sets state p1,
%checks if game ended and displays
									
process_p2(_,_,_,_,_,_,_,ValPosition, _):-	

								ValPosition == 'false',
								write('Invalid Position to Play'), nl.
								
process_p2(_,_,_,_,_,_,_,_, ValFlower):-		

								ValFlower == 'false',
								write('Flower inexistent in Case'), nl.
								
process_p2(XPlay,YPlay,Flower,X,Y,PlayerStat,P1,_, _):-
							
								delete_flower_p2(Flower),
								place_elem_table(XPlay, YPlay, Flower),									
								calculate_score(XPlay, YPlay, Flower, Scorelist),
								length(Scorelist, Score),
								update_score_p2(X, Y, PlayerStat, Score, P1),
								set_state_p1(_),
								check_scores_and_set_state(Flower),
								display_game(_).
								
%================================================================================================				
%gets the current game state
get_state(Val):- state(Val).

%sets the current game state
set_state_end(_):- asserta(state('end')).					
set_state_start(_):- asserta(state('start')).
set_state_p1(_):- asserta(state('p1')).
set_state_p2(_):- asserta(state('p2')).

%prints state
print_state(_):-	get_state(Val),
					state_print(Val).
					
%prints message of state
state_print(Val):-  	
					Val == 'p1', nl,
					print('Player 1 or player "F" make your move.'), nl.
					
state_print(Val ):-  	
					Val == 'p2', nl,
					print('Player 2 or player "S" make your move.'), nl.
					
state_print(Val ):-  	
					Val == 'end', nl,
					print('Game is finished.'), nl.
					
state_print(Val ):-  	
					Val == 'start', nl,
					print('Loading Game ...'), nl.
					
%================================================================================================					
%place player in positions X Y of board
place_p1(X,Y):- 
				get_elem(X, Y, Val),
				Val1 is integer(Val),
				Elem is Val1 + 100,
				place_elem_table(X, Y, Elem).
				
place_p2(X,Y):- 
				get_elem(X, Y, Val),
				Val1 is integer(Val),
				Elem is Val1 + 200,
				place_elem_table(X, Y, Elem).
%================================================================================================	
%fucntion to check if game has ended, has ended if the difference between scores is bigger than 39,
% (one player overlaped the other), and ends if the last flower of a type was placed in the board
check_scores_and_set_state(Flower):- 	
										check_if_flower_exists_p1(Flower, ValP1),
										check_if_flower_exists_p2(Flower, ValP2),
										
										score_p1(ScoreP1),
										score_p2(ScoreP2),
										
										Diff is ScoreP1 - ScoreP2,
										Val is abs(Diff),
										
										check_flower_and_score(ValP1, ValP2, Val).

%checks difference in scores and if last flower of type planted										
check_flower_and_score(ValP1, ValP2, _):- 		ValP1 == 'false', ValP2 = 'false',
												set_state_end(_).
															
check_flower_and_score(_, _, Diff):- 	
												Diff >= 39,
												set_state_end(_).
												
check_flower_and_score(_, _,_).
										
										
%================================================================================================									
%check if coords exsit in list of possible plays
check_if_valid_position(XPlay, YPlay, [], Val):- 		Val = 	'false',
														XPlay = XPlay, YPlay = YPlay.

check_if_valid_position(XPlay, YPlay, [P|Rest], Val):- 	
														check_point(XPlay,YPlay,P,Rest,Val).
%check if point exists
check_point(XPlay,YPlay,[X | Y],Rest, Val):- 	
												X == XPlay, Y == YPlay, Val = 'true', Rest = Rest.
												
check_point(XPlay,YPlay,[X | Y],Rest, Val):-	X = X, Y = Y,
												check_if_valid_position(XPlay, YPlay, Rest, Val).
	


%================================================================================================		
%check if flower exists in p1 case and p2 respectivelly
check_if_flower_exists_p1(Flower, ValFlower):- 	
												case_p1(CASE),
												exists_Flower(Flower, CASE, ValFlower).
												
check_if_flower_exists_p2(Flower, ValFlower):- 	
												case_p2(CASE),
												exists_Flower(Flower, CASE, ValFlower).
%exists flower in list of flowers												
exists_Flower(Flower, [], ValFlower):- 	Flower = Flower, ValFlower = 'false'.
exists_Flower(Flower, [FlowerN | _], ValFlower):- Flower == FlowerN, ValFlower = 'true'.	
exists_Flower(Flower, [_ | Rest], ValFlower):- exists_Flower(Flower, Rest, ValFlower).	
%================================================================================================	
%caculate score of play
calculate_score(XPlay, YPlay, Flower, Score):- 		calculate_arround(XPlay, YPlay, Flower, Score).

															
%score is calculated in orthogonal directions. score is incremented if there 
%is contiguous flower of equal type of the one that was just planted															
calculate_arround(XPlay, YPlay, Flower, Scoretemp):-
																caculate_left(XPlay, YPlay, Flower, Score1),
																caculate_right(XPlay, YPlay, Flower, Score2),
																caculate_up(XPlay, YPlay, Flower, Score3),
																caculate_down(XPlay, YPlay, Flower, Score4),
																
																
																append(Score1, Score2, Scoretemp1),
																append(Scoretemp1, Score3, Scoretemp2),
																append(Scoretemp2, Score4, Scoretemp3),
																
																append(Scoretemp3, [1], Scoretemp).
															
%search left for flowers																										
caculate_left(X, Y, Flower, Scoretemp):-	
												X > 1, X < 11,
												Y > 1, Y < 11,
												
												XNew is X - 1,
												
												XNew > 1,

												get_elem(XNew, Y, Elem),
												next_left(XNew, Y, Flower, Elem, Scoretemp).
										
caculate_left(X, Y, Flower, Scoretemp):- 		List1 = [],
												append(List1, [], Scoretemp),
												X = X, Y = Y, Flower = Flower, Scoretemp = Scoretemp.
%next elem left										
next_left(X, Y, Flower,Elem, Scoretemp):-		
												Flower == Elem, 												
												caculate_left(X, Y, Flower, List1),
												append(List1, [1], Scoretemp).
																	
next_left(X, Y, Flower,Elem, Scoretemp):- 	List1 = [],
											append(List1,  [], Scoretemp),
											X = X, Y = Y, Flower = Flower, Elem = Elem, Scoretemp = Scoretemp.
											
%search right for flowers
caculate_right(X, Y, Flower, Scoretemp):-	
												X > 1, X < 11,
												Y > 1, Y < 11,
												
												XNew is X + 1,
												
												XNew < 11,

												get_elem(XNew, Y, Elem),
												next_right(XNew, Y, Flower, Elem, Scoretemp).
										
caculate_right(X, Y, Flower, Scoretemp):- 		List1 = [],
												append(List1, [], Scoretemp),
												X = X, Y = Y, Flower = Flower, Scoretemp = Scoretemp.
%next elem right										
next_right(X, Y, Flower,Elem, Scoretemp):-		
												Flower == Elem, 												
												caculate_right(X, Y, Flower, List1),
												append(List1, [1], Scoretemp).
																	
next_right(X, Y, Flower,Elem, Scoretemp):- 	List1 = [],
											append(List1,  [], Scoretemp),
											X = X, Y = Y, Flower = Flower, Elem = Elem, Scoretemp = Scoretemp.
											
%search down for flowers
caculate_down(X, Y, Flower, Scoretemp):-	
												X > 1, X < 11,
												Y > 1, Y < 11,
												
												YNew is Y + 1,
												
												YNew < 11,

												get_elem(X, YNew, Elem),
												next_down(X, YNew, Flower, Elem, Scoretemp).

												
caculate_down(X, Y, Flower, Scoretemp):- 		List1 = [],
												append(List1, [], Scoretemp),
												X = X, Y = Y, Flower = Flower, Scoretemp = Scoretemp.
%next elem down											
next_down(X, Y, Flower,Elem, Scoretemp):-		
												Flower == Elem, 												
												caculate_down(X, Y, Flower, List1),
												append(List1, [1], Scoretemp).
																	
next_down(X, Y, Flower,Elem, Scoretemp):- 	List1 = [],
											append(List1,  [], Scoretemp),
											X = X, Y = Y, Flower = Flower, Elem = Elem, Scoretemp = Scoretemp.
											
%search up for flowers
caculate_up(X, Y, Flower, Scoretemp):-	
												X > 1, X < 11,
												Y > 1, Y < 11,
												
												YNew is Y - 1,
												
												YNew > 1,

												get_elem(X ,YNew, Elem),
												next_up(X, YNew, Flower, Elem, Scoretemp).
										
caculate_up(X, Y, Flower, Scoretemp):- 			List1 = [],
												append(List1, [], Scoretemp),
												X = X, Y = Y, Flower = Flower, Scoretemp = Scoretemp.
%next elem up										
next_up(X, Y, Flower,Elem, Scoretemp):-		
												Flower == Elem, 												
												caculate_up(X, Y, Flower, List1),
												append(List1, [1], Scoretemp).
																	
next_up(X, Y, Flower,Elem, Scoretemp):- 	List1 = [],
											append(List1,  [], Scoretemp),
											X = X, Y = Y, Flower = Flower, Elem = Elem, Scoretemp = Scoretemp.
											
											
%================================================================================================
%update score player 1 
update_score_p1(X,Y,PlayerStat, Score, P2):- 
												P2Score is P2 - 200,
												P1Score is PlayerStat - 100,												
												NextScore is P1Score + Score,											
												place_elem_table(X, Y, P1Score),												
												score_p1(SCORE),
												NewScore is SCORE + Score,
												asserta(score_p1(NewScore)),											
												move_p1(P1Score, NextScore, P2Score).
												
%move player 1 in table											
move_p1(P1Place, NextP1Place, P2Place):- 		P1Place < P2Place, NextP1Place >= P2Place,
												NewPlace is NextP1Place + 1,												
												assert_place_p1(NewPlace).
												
											
move_p1(P1Place, NextP1Place, P2Place):-	
												P1Place = P1Place,
												NextP1Place > 49,
												N is NextP1Place - 50,
												NewPlace is N + 10,		
												NewPlace >= P2Place,												
												N1 is NewPlace + 1,	
												assert_place_p1(N1).
												
											
move_p1(P1Place, NextP1Place, P2Place):-		P1Place = P1Place,
												NextP1Place > 49,
												N is NextP1Place - 50,
												NewPlace is N + 10,												
												NewPlace < P2Place,									
												assert_place_p1(NewPlace).
												
move_p1(_, NextP1Place, _):-		assert_place_p1(NextP1Place).

%place player 1 in table for the new position
assert_place_p1(NewPlace):- 		
										NewPlace > 49,
										Nindex is NewPlace - 50,										
										N is Nindex + 10,
										get_coords_elem(X, Y, N),
										Player is N + 100,
										place_elem_table(X, Y, Player).
										
										
assert_place_p1(NewPlace):-				get_coords_elem(X, Y, NewPlace),
										Player is NewPlace + 100,
										place_elem_table(X, Y, Player).	

%================================================================================================
%update score player 2
update_score_p2(X,Y,PlayerStat, Score, P1):- 
												P1Score is P1 - 100,
												P2Score is PlayerStat - 200,												
												NextScore is P2Score + Score,											
												place_elem_table(X, Y, P2Score),												
												score_p2(SCORE),
												NewScore is SCORE + Score,
												asserta(score_p2(NewScore)),											
												move_p2(P2Score, NextScore, P1Score).
												
%move p2 in table											
move_p2(P2Place, NextP2Place, P1Place):- 		P2Place < P1Place, NextP2Place >= P1Place,
												NewPlace is NextP2Place + 1,												
												assert_place_p2(NewPlace).
												
											
move_p2(P2Place, NextP2Place, P1Place):-	
												P2Place = P2Place,
												NextP2Place > 49,
												N is NextP2Place - 50,
												NewPlace is N + 10,		
												NewPlace >= P1Place,												
												N1 is NewPlace + 1,	
												assert_place_p2(N1).
												
											
move_p2(P2Place, NextP2Place, P1Place):-		P2Place = P2Place,
												NextP2Place > 49,
												N is NextP2Place - 50,
												NewPlace is N + 10,												
												NewPlace < P1Place,									
												assert_place_p2(NewPlace).
												
move_p2(_, NextP2Place, _):-		assert_place_p2(NextP2Place).

%place player 2 in new position
assert_place_p2(NewPlace):- 		
										NewPlace > 49,
										Nindex is NewPlace - 50,										
										N is Nindex + 10,
										get_coords_elem(X, Y, N),
										Player is N + 200,
										place_elem_table(X, Y, Player).
										
										
assert_place_p2(NewPlace):-				get_coords_elem(X, Y, NewPlace),
										Player is NewPlace + 200,
										place_elem_table(X, Y, Player).											
							
										
											
												
							

												
												
												
												