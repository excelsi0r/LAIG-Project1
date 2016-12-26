:-use_module(library(lists)).
:-use_module(library(random)).

:-include('bubblesort.pl').

:- 	dynamic
	board/1,
	case/1.

%Board and cases.
%default board for intial reset
board_default( [[40,41,42,43,44,45,46,47,48,49,10],
				[39,0,0,0,0,0,0,0,0,0,11],
				[38,0,0,0,0,0,0,0,0,0,12],
				[37,0,0,0,0,0,0,0,0,0,13],
				[36,0,0,0,0,0,0,0,0,0,14],
				[35,0,0,0,0,0,0,0,0,0,15],
				[34,0,0,0,0,0,0,0,0,0,16],
				[33,0,0,0,0,0,0,0,0,0,17],
				[32,0,0,0,0,0,0,0,0,0,18],
				[31,0,0,0,0,0,0,0,0,0,19],
				[30,29,28,27,26,25,24,23,22,21,20]]).
				
%board were it will be played
board(_).

%default initial case
case_default(	[1,1,1,1,1,1,1,1,1,1,
				 2,2,2,2,2,2,2,2,2,2,
				 3,3,3,3,3,3,3,3,3,3,
				 4,4,4,4,4,4,4,4,4,4,
				 5,5,5,5,5,5,5,5,5,5,
				 6,6,6,6,6,6,6,6,6,6]).

%case where the remaining floweres are stored
case(_).				 

%display reasons
matrix_coord([0,1,2,3,4,5,6,7,8]).

%=========================================================================================
%display boards and matrix to help
display_table(_):- 
					nl,
					matrix_coord(M),
					board(TABLE),
					print_matrix_up(M, 0),
					print_table(TABLE, M, 0), 
					print_matrix_up(M, 0),
					nl.

%=========================================================================================			
%reset board and case to their defaults
reset_board(_):- 	
					board_default(DEFAULT),
					asserta(board(DEFAULT)),
					case_default(DEFCASE),
					asserta(case(DEFCASE)).
					
%=========================================================================================			
%get valid plays from a list given a XY and acording to the player being on the left, right, down or up on the board
get_list_of_plays(X,Y,List):- 	X == 1, get_list_of_plays_left(X,Y,List).
get_list_of_plays(X,Y,List):- 	X == 11, get_list_of_plays_rigth(X,Y,List).
get_list_of_plays(X,Y,List):- 	Y == 1, get_list_of_plays_up(X,Y,List).
get_list_of_plays(X,Y,List):- 	Y == 11, get_list_of_plays_down(X,Y,List).

%function to get List of plays if player is on the left of the board
get_list_of_plays_left(X, Y, List):- 
										Listtemp = [],
										get_list_inc(X, Y, 1, 0, Listtemp,List1),Listtemp = [],
										get_list_inc(X, Y, 1, -1, Listtemp,List2),Listtemp = [],
										get_list_inc(X, Y, 1, 1, Listtemp,List3),
										
										append(List1, List2, Listtemp1),
										append(Listtemp1, List3, List).
										
%function to get List of plays if player is up on the board								
get_list_of_plays_up(X, Y, List):-	
										Listtemp = [], 
										get_list_inc(X, Y, 0, 1,Listtemp, List1),Listtemp = [],
										get_list_inc(X, Y, -1, 1,Listtemp, List2),Listtemp = [],
										get_list_inc(X, Y, 1, 1, Listtemp,List3),
										
										append(List1, List2, Listtemp1),
										append(Listtemp1, List3, List).

%function to get List of plays if player is down on the board								
get_list_of_plays_down(X, Y, List):-	
										Listtemp = [],
										get_list_inc(X, Y, 0, -1, Listtemp,List1),Listtemp = [],
										get_list_inc(X, Y, -1, -1, Listtemp,List2),Listtemp = [],
										get_list_inc(X, Y, 1, -1, Listtemp,List3),
										
										append(List1, List2, Listtemp1),
										append(Listtemp1, List3, List).

%function to get List of plays if player on the right of the board										
get_list_of_plays_rigth(X, Y, List):-	
										Listtemp = [],
										get_list_inc(X, Y, -1, 0, Listtemp, List1), Listtemp = [],
										get_list_inc(X, Y, -1, -1, Listtemp, List2),Listtemp = [],
										get_list_inc(X, Y, -1, 1, Listtemp, List3),
									
										
										append(List1, List2, Listtemp1),
										append(Listtemp1, List3, List).	
	

%get list of plays given a recursive X increment and Y increment on the board from a point on the board
get_list_inc(X, Y, Xinc, Yinc, Listtemp, List):- 

													NewX is X + Xinc,
													NewY is Y + Yinc,
													
													get_elem(NewX, NewY, Val),
													
													process_new_coords(NewX, NewY, Xinc, Yinc, Val, Listtemp, List).
										
										
%while getting the list of plays, the process_new_coords will be invoked to process valid coords. 
%case if finds a Tree, is not empty or if is out of the board limits.
process_new_coords(_, _, _, _, Val, _, List):-	
																	Val == 'null',
																	List = [].
																	
																		
process_new_coords(NewX, NewY, Xinc, Yinc, Val, Listtemp, List):-
																	NewX > 1, NewX < 11,
																	NewY > 1, NewY < 11,
																	
																	Val == 0,
																	
																	P = [[NewX | NewY]],
																	append(Listtemp, P, List1),
																
																	get_list_inc(NewX, NewY, Xinc, Yinc, List1, List).
																	
process_new_coords(NewX, NewY, Xinc, Yinc, Val, Listtemp, List):-
																	Val > 0, Val < 7,
																	get_list_inc(NewX, NewY, Xinc, Yinc, Listtemp, List).
															
process_new_coords(NewX, NewY, Xinc, Yinc, Val, Listtemp, List):- 	Val == 7,
																	List = Listtemp,
																	NewX = NewX, NewY = NewY, 
																	Xinc = Xinc, Yinc = Yinc, 
																	Listtemp = Listtemp.
															
															
process_new_coords(NewX, NewY, Xinc, Yinc, Val, Listtemp, List):- 	List = Listtemp,
																	Val = Val, 
																	NewX = NewX, NewY = NewY, 
																	Xinc = Xinc, Yinc = Yinc.
																
														
%=========================================================================================			
%Distribute flowers to players from case to each player individual case. 
%The distribuition is random. Gives flower to player case through a random index pointing
%to the general case.
%Sort in the end with bubble_sort
distribute_flowers(0,_):- 
							case_p1(CASEP1),
							bubble_sort(CASEP1, NEWCASE1),
							asserta(case_p1(NEWCASE1)),
							
							case_p2(CASEP2),
							bubble_sort(CASEP2, NEWCASE2),
							asserta(case_p2(NEWCASE2)).
							
									
distribute_flowers(N,NFlowers):- 
									generate_Index(NFlowers,Index1),
									take_flower_from_case(Index1, Val),
									give_flower_p1(Val),
									
									NFlowers1 is NFlowers - 1,
									
									generate_Index(NFlowers1,Index2),
									take_flower_from_case(Index2, Val1),
									give_flower_p2(Val1),
									
									N1 is N - 1,
									NFlowers2 is NFlowers1 - 1,
									distribute_flowers(N1, NFlowers2).
									
%given the Number of Floweers available generates a random value between 1 and the number.
generate_Index(NFlowers, Val):-

									L is 1.0,
									U is NFlowers,
									random(L,U,Val1),
									Val is integer(Val1).

%takes flower with index N from Case									
take_flower_from_case(N, Val):- 
									case(CASE),
									nth1(N, CASE, Val,NEWCASE),
									asserta(case(NEWCASE)).	

%gives new flower to player 1 case
give_flower_p1(Val):- 
						case_p1(CASEP1), 
						append(CASEP1, [Val], NEWCASE),
						asserta(case_p1(NEWCASE)).

%gives new flower to player 2 case						
give_flower_p2(Val):- 	
						case_p2(CASEP2),
						append(CASEP2, [Val], NEWCASE),
						asserta(case_p2(NEWCASE)).
						
%========================================================================================									
%random put N trees in board
place_trees(0).
place_trees(N):- 
					generate_X_Y_Val(X, Y, Val),
					place_tree(X,Y,Val,N).
					
place_tree(X, Y, Val, N):- 
							Val == 0,
							place_elem_table(X, Y, 7),
							N1 is N - 1,
							place_trees(N1).
							
place_tree(X, Y, Val, N):- 
							Val \= 0,
							X = X, Y = Y,
							place_trees(N).
			
%generates a random Coord inside the playable area on the board.
generate_X_Y_Val(X, Y, Val):- 
								L is 2.0,
								U is 11.0,
								random(L,U,X1),
								random(L,U,Y1),
								X is integer(X1),
								Y is integer(Y1),
								get_elem(X, Y, Val).
			
			
%========================================================================================			
%get elem from board in coords X, Y
get_elem(X, Y, Val):- 
						X >= 1, Y >= 1, X =< 11, Y =< 11,
						board(TABLE),
						nth1(Y, TABLE, Line), 
						nth1(X, Line, Val).
						
get_elem(X, Y, Val):- 
						X = X, Y = Y,
						Val = 'null'.

%========================================================================================						
%get coords X, Y, given Elem
get_coords_elem(X, Y, Elem):-  get_coords(X, Y, Elem, 1,1).

get_coords(X, Y, Elem, Xi, Yi):-	get_elem(Xi, Yi, Val),
									Val == Elem,
									X = Xi, Y = Yi.

get_coords(X, Y, Elem, Xi, Yi):-	calculate_next_board_coords(Xi, Yi, NewX, NewY),
									Elem = Elem,
									get_coords(X, Y, Elem, NewX, NewY).

%========================================================================================									
%get player1, searchs values from 110 to 149 and returns the first ocurrence on board
%while in the game it is suposed to exist only one value between that interval
get_player1(X,Y, Stat):- get_coords_p1(X, Y, 1,1, Stat).


get_coords_p1(X, Y, Xtemp, Ytemp, Stat):- 
											get_elem(Xtemp, Ytemp, Val),
											check_and_next1(X, Y, Xtemp, Ytemp, Val, Stat).

%process if is player1 or not in X Y,if not calculates new value coords	for board.									
check_and_next1(X, Y, Xtemp, Ytemp, Val, Stat):- 	Val > 109, Val < 150,
													Stat = Val,
													X is Xtemp, Y is Ytemp,
													Val = Val.

check_and_next1(X, Y, Xtemp, Ytemp, Val, Stat):-	
													Val = Val,
													calculate_next_board_coords(Xtemp, Ytemp, NewX, NewY),
													get_coords_p1(X,Y,NewX, NewY, Stat).
											
%get player2, searchs values from 210 to 249 and returns the first ocurrence on board
%while in the game it is suposed to exist only one value between that interval
get_player2(X,Y, Stat):- get_coords_p2(X, Y, 1,1, Stat).


get_coords_p2(X, Y, Xtemp, Ytemp, Stat):- 
										get_elem(Xtemp, Ytemp, Val),
										check_and_next2(X, Y, Xtemp, Ytemp, Val, Stat).

%process if is player2 or not in X Y,if not calculates new value coords	for board.											
check_and_next2(X, Y, Xtemp, Ytemp, Val, Stat):- 	Val > 209, Val < 250,
													Stat = Val,
													X is Xtemp, Y is Ytemp,
													Val = Val.

check_and_next2(X, Y, Xtemp, Ytemp, Val, Stat):-	
													Val = Val,
													calculate_next_board_coords(Xtemp, Ytemp, NewX, NewY),
													get_coords_p2(X,Y,NewX, NewY, Stat).
											
%iterate new value coords on board 									
calculate_next_board_coords(Xtemp, Ytemp, NewX, NewY):-		
															Xtemp == 11,
															NewX is 1,
															NewY is Ytemp + 1.

calculate_next_board_coords(Xtemp, Ytemp, NewX, NewY):- 	NewX is Xtemp + 1,
															NewY is Ytemp.

%=======================================================================================	
%display elem placed in X Y
display_elem_table(X, Y):-
								get_elem(X, Y, Val),
								print(Val),
								nl.

%=======================================================================================
%places new Elem in X Y of board
place_elem_table(X,Y,Elem):-
								X >= 1, X =< 11,
								Y >= 1, X =< 11,
								get_elem(X,Y,Val),
								Val \= 'null',
								board(TABLE),
								place_elem(X,Y,Elem,TABLE,NewTable),
								retract(board(TABLE)),
								asserta(board(NewTable)).
								
place_elem_table(X,Y,Elem):-
								X = X, Y = Y,
								Elem = Elem,
								write('Invalid Coords to place '), nl.
								

%iterate board line 								
place_elem(X,Y,Elem,[Head | Tail], [HeadNew | TailNew]):- 
															Y == 1, 
															place_elem_line(X,Elem,Head, HeadNew),
															TailNew = Tail.
										
place_elem(X,Y,Elem,[Head | Tail], [HeadNew | TailNew]):- 
															Y > 0, 
															Y1 is Y - 1,
															HeadNew = Head,
															place_elem(X, Y1, Elem, Tail, TailNew).
										
%iterate board elem 										
place_elem_line(X, Elem, [_| Tail], [HeadNew | TailNew]):- 
																
																X == 1,
																HeadNew = Elem,
																TailNew = Tail.

place_elem_line(X,Elem,[Head | Tail], [HeadNew | TailNew]):- 

																X > 0,
																X1 is X - 1,
																HeadNew = Head,
																place_elem_line(X1, Elem, Tail, TailNew).
						
						
						
		
%=======================================================================================		
%Print Table function
print_table([], [], NUM):- NUM \= 0, nl, nl.
print_table([Line|Rest], M, NUM):-

							NUM < 1,
							nl, print('    '),
							print_line(Line),
							print_table(Rest, M, NUM + 1).
							
							
print_table([Line|Rest], M, NUM):-

							NUM > 9,
							nl, print('    '),
							print_line(Line),
							print_table(Rest, M, NUM + 1).
							
print_table([Line|Rest], [Index | IRest], NUM):-

							NUM \= 0,
							nl,
							print(Index), print('   '),
							print_line(Line), print('  '),
							print(Index),
							print_table(Rest, IRest, NUM + 1).
							
%prints a line						
print_line([]).
print_line([Cell|Rest]):-	
							Cell < 10,
							print_elem(Cell),
							print(' '),
							print_line(Rest).

print_line([Cell|Rest]):-	
							Cell >= 10, Cell < 100,
							NM is mod(Cell, 10),
							print(NM),
							print(' '),
							print_line(Rest).
							
print_line([Cell|Rest]):-	
							Cell >= 100,
							print_player(Cell),
							print(' '),
							print_line(Rest).
							
							
							
%print elem and according conversions
print_elem(Cell):- Cell == 0, print('-').
print_elem(Cell):- Cell == 7, print('T').
print_elem(Cell):- Cell == 1, print('w').
print_elem(Cell):- Cell == 2, print('y').
print_elem(Cell):- Cell == 3, print('g').
print_elem(Cell):- Cell == 4, print('b').
print_elem(Cell):- Cell == 5, print('p').
print_elem(Cell):- Cell == 6, print('r').

%=======================================================================================
%print player on board
print_player(Cell):- 
						Cell > 109, 
						Cell < 150,
						print('F').
						
print_player(Cell):- 	
						Cell > 209, 
						Cell < 250, 
						print('S').
						
print_player(Cell):- 	
						Cell == Cell,
						print('E').


%=======================================================================================							
%print matrix uper
print_matrix_up([], NUM) :- NUM \= 0, nl.						
print_matrix_up([Line|Rest], NUM):- 	
									NUM == 0,
									print('      '),
									print(Line),
									print_matrix_up(Rest, NUM + 1).
									
print_matrix_up([Line|Rest], NUM):- 	
									NUM \= 0,
									print(' '),
									print(Line),
									print_matrix_up(Rest, NUM + 1).
					