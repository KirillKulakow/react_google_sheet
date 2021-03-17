import React, { useState, useEffect, Fragment } from 'react';
import { Table, Button, Form, Container, Header } from 'semantic-ui-react';
import uniqid from "uniqid";
import axios from 'axios';
import './App.css';

function App() {
	const [name, setName] = useState('');
	const [age, setAge] = useState('');
	const [salary, setSalary] = useState('');
	const [hobby, setHobby] = useState('');
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		const objt = { id: uniqid.time(), name, age, salary, hobby };
		axios
			.post('https://sheet.best/api/sheets/3ef36b6f-f2d7-4d55-803d-cd3ae1d5c041', objt)
			.then((response) => {
				setData((prev) => ([...prev, ...response.data]));
				setName("");
				setAge("");
				setSalary("");
				setHobby("");
			});
	};

	const getData = () => {
		setIsLoading(true);
		axios.get('https://sheet.best/api/sheets/3ef36b6f-f2d7-4d55-803d-cd3ae1d5c041')
		.then((res) => {
			setData(res.data)
			setIsLoading(false);
		})
		.catch((error) => {
			console.log(error);
			setIsLoading(false);
		})
	};

	useEffect(() => {
		getData();
	}, [])

	const deleteElement = (id) => () => {
		setIsLoadingDelete(true);
		axios.delete(`https://sheet.best/api/sheets/3ef36b6f-f2d7-4d55-803d-cd3ae1d5c041/id/${id}`)
		.then((res) => {
			setData(prev => prev.filter(el => el.id !== res.data[0].id));
			setIsLoadingDelete(false);
		})
		.catch((error) => {
			console.log(error);
			setIsLoadingDelete(false);
		})
	};

	return (
		<Container fluid className="container">
			<Header as="h2">React google sheet</Header>
			<Form className="form">
				<Form.Field>
					<label>Name</label>
					<input
						value={name}
						placeholder="Enter your Name"
						onChange={(e) => setName(e.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Age</label>
					<input
						value={age}
						placeholder="Enter your Age"
						onChange={(e) => setAge(e.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Salary</label>
					<input
						value={salary}
						placeholder="Enter your Salary"
						onChange={(e) => setSalary(e.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Hobby</label>
					<input
						value={hobby}
						placeholder="Enter your Hobby"
						onChange={(e) => setHobby(e.target.value)}
					/>
				</Form.Field>

				<Button color="blue" type="submit" onClick={handleSubmit}>
					Submit
				</Button>
			</Form>
			<Table celled>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Age</Table.HeaderCell>
						<Table.HeaderCell>Salary</Table.HeaderCell>
						<Table.HeaderCell>Hobby</Table.HeaderCell>
						<Table.HeaderCell></Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{isLoading ? 
					<Table.Row>
						<Table.Cell>Loading ... </Table.Cell>
					</Table.Row>
					:
					!data.length ? 
					(<>
					<Table.Row>
						<Table.Cell>No data</Table.Cell>
					</Table.Row>
					</>) : (
						data.map((el) => (
							<Table.Row key={el.id}>
								<Table.Cell>{el.name}</Table.Cell>
								<Table.Cell>{el.age}</Table.Cell>
								<Table.Cell>{el.salary}</Table.Cell>
								<Table.Cell>{el.hobby}</Table.Cell>
								<Table.Cell width={1}><Button loading={isLoadingDelete} color="red" onClick={deleteElement(el.id)}>Delete</Button></Table.Cell>
							</Table.Row>
						))
					)
					}
				</Table.Body>
			</Table>
		</Container>
	);
}

export default App;
